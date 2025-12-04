import { baseApi } from '@/app/api/baseApi.ts'
import type { LoginArgs, LoginResponse, MeResponse } from '@/feature/auth/api/authApi.type.ts'
import { AUTH_KEYS } from '@/common/common/constants/constants.ts'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => 'auth/me',
      providesTags: ['Auth'],
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (payload) => ({
        method: 'post',
        url: 'auth/login',
        body: { ...payload, accessTokenTTL: '20m' },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
        // Invalidate after saving tokens
        dispatch(authApi.util.invalidateTags(['Auth']))
      },
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return { method: 'post', url: 'auth/logout', body: { refreshToken } }
      },
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi

// import { baseApi } from '@/app/api/baseApi.ts'
// import type { LoginArgs, LoginResponse, MeResponse } from '@/feature/auth/api/authApi.type.ts'
// import { AUTH_KEYS } from '@/common/common/constants/constants.ts'
//
// export const authApi = baseApi.injectEndpoints({
//   endpoints: (build) => {
//     return {
//       _getMe: build.query<MeResponse, void>({
//         query: () => 'auth/me',
//         providesTags: ['Auth'],
//       }),
//       getMe: build.query<MeResponse, void>({
//         query: () => ({
//           url: `auth/me`,
//         }),
//         // `playlists?search=${search}&userId=569`,
//         providesTags: ['Auth'],
//       }),
//       login: build.mutation<LoginResponse, LoginArgs>({
//         query: (args) => ({
//           method: 'post',
//           url: 'auth/login',
//           body: { ...args, accessTokenTTL: '30m' },
//         }),
//
//         onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
//           const { data } = await queryFulfilled
//           localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
//           localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
//           dispatch(authApi.util.invalidateTags(['Auth']))
//         },
//       }),
//       logout: build.mutation<void, void>({
//         query() {
//           const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
//           return {
//             method: 'post',
//             url: 'auth/logout',
//             body: { refreshToken },
//           }
//         },
//         onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
//           await queryFulfilled
//           localStorage.removeItem(AUTH_KEYS.refreshToken)
//           localStorage.removeItem(AUTH_KEYS.accessToken)
//           dispatch(baseApi.util.resetApiState())
//         },
//       }),
//     }
//   },
// })
//
// export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi
