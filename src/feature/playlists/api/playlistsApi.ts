import type {
  CreatePlaylistArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/feature/playlists/api/PlaylistsApi.types.ts'
import { baseApi } from '@/app/baseApi.ts'

export const playlistsApi = baseApi.injectEndpoints({
  // reducerPath: '/playlistsApi',
  // tagTypes: ['playlists'],
  // baseQuery: fetchBaseQuery({
  //   baseUrl: import.meta.env.VITE_BASE_URL,
  //   headers: {
  //     'API-KEY': import.meta.env.VITE_API_KEY,
  //   },
  //   prepareHeaders: (headers) => {
  //     headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
  //     return headers
  //   },
  // }),
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => `playlists`,
      providesTags: ['playlists'],
      //{return { url: `playlists` } },
    }),

    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: 'post',
        url: 'playlists',
        body,
      }),
      invalidatesTags: ['playlists'],
    }),

    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        method: 'delete',
        url: `playlists/${playlistId}`,
      }),
      invalidatesTags: ['playlists'],
    }),

    updatePlaylist: build.mutation<void, { playlistId: string; args: UpdatePlaylistArgs }>({
      query: ({ playlistId, args }) => ({
        method: 'put',
        url: `playlists/${playlistId}`,
        body: args,
      }),
      invalidatesTags: ['playlists'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistsApi
