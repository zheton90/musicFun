import { baseApi } from '@/app/api/baseApi.ts'
import type { LoginArgs, LoginResponse, MeResponse } from '@/feature/auth/api/authApi.type.ts'
import { AUTH_KEYS } from '@/common/common/constants/constants.ts'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => ({
        url: 'auth/me',
      }),
      providesTags: ['auth'],
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (args) => ({
        method: 'post',
        url: 'auth/login',
        body: { ...args, accessTokenTTL: '3m' },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
        dispatch(authApi.util.invalidateTags(['auth']))
      },
    }),
    logout: build.mutation<void, void>({
      query() {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return {
          method: 'post',
          url: 'auth/logout',
          body: { refreshToken },
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        localStorage.removeItem(AUTH_KEYS.accessToken)
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi
