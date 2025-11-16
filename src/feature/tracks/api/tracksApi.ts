import { baseApi } from '@/app/baseApi.ts'
import type { FetchTracksResponse } from '@/feature/tracks/api/tracksApi.types.ts'

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          return lastPage.meta.nextCursor
        },
      },
      query: ({ pageParam }) => {
        return {
          url: 'playlists/tracks',
          params: { paginationType: 'cursor', pageSize: 10, cursor: pageParam },
        }
      },
    }),
  }),
})

export const { useFetchTracksInfiniteQuery } = tracksApi
