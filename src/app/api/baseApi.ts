import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTH_KEYS } from '@/common/common/constants/constants.ts'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['playlists', 'auth'],
  baseQuery: async (args, api, extraOptions) => {
    await new Promise((res) => {
      setTimeout(res, 2000)
    })
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)
        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers
      },
    })(args, api, extraOptions)

    return result
  },
  endpoints: () => ({}),
})
