import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse } from '@/feature/playlists/api/PlaylistsApi.types.ts'

export const playlistsApi = createApi({
  reducerPath: '/playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
    },
  }),
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => `playlists`,
      //{return { url: `playlists` } },
    }),

    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: 'post',
        url: 'playlists',
        body,
      }),
    }),
  }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation } = playlistsApi
