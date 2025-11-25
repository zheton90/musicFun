import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/feature/playlists/api/PlaylistsApi.types.ts'
import { baseApi } from '@/app/baseApi.ts'
import type { Images } from '@/common/types'

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

  endpoints: (build) => {
    return {
      fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
        query: (params) => ({
          url: `playlists`,
          params,
        }),
        // `playlists?search=${search}&userId=569`,
        providesTags: ['playlists'],
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
        query: ({ playlistId, args }) => {
          return {
            method: 'put',
            url: `playlists/${playlistId}`,
            body: args,
          }
        },
        async onQueryStarted({ playlistId, args }, { dispatch, queryFulfilled, getState }) {
          const datas = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

          const putchResults: any[] = []

          datas.forEach((el) => {
            putchResults.push(
              dispatch(
                playlistsApi.util.updateQueryData(
                  'fetchPlaylists',
                  {
                    pageNumber: el.pageNumber,
                    pageSize: el.pageSize,
                    search: el.search,
                  },
                  (state) => {
                    const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                    if (index !== -1) {
                      state.data[index].attributes = { ...state.data[index].attributes, ...args }
                    }
                  },
                ),
              ),
            )
          })

          try {
            await queryFulfilled
          } catch {
            putchResults.forEach((el) => {
              el.undo()
            })
          }
        },
        invalidatesTags: ['playlists'],
      }),

      uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
        query: ({ playlistId, file }) => {
          const formData = new FormData()
          formData.append('file', file)
          return {
            method: 'post',
            url: `playlists/${playlistId}/images/main`,
            body: formData,
          }
        },
        invalidatesTags: ['playlists'],
      }),

      deletePlaylistCover: build.mutation<void, { playlistId: string }>({
        query: ({ playlistId }) => ({
          method: 'delete',
          url: `playlists/${playlistId}/images/main`,
        }),
        invalidatesTags: ['playlists'],
      }),
    }
  },
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
