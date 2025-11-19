import type { RootState } from '@/app/model/store.ts'
import { useSelector } from 'react-redux'
import { playlistsApi } from '@/feature/playlists/api/playlistsApi.ts'
import { tracksApi } from '@/feature/tracks/api/tracksApi.ts'

const excludedEndpoints = [playlistsApi.endpoints.fetchPlaylists.name, tracksApi.endpoints.fetchTracks.name]

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    const queries = Object.values(state.baseApi.queries || {})
    const mutations = Object.values(state.baseApi.mutations || {})

    const hasActiveQueries = queries.some((query) => {
      if (query?.status !== 'pending') return
      if (excludedEndpoints.includes(query?.endpointName)) {
        const complitedQueries = queries.filter((q) => q?.status === 'fulfilled')
        return complitedQueries.length > 0
      }
    })
    const hasActiveMutations = mutations.some((mutation) => mutation?.status === 'pending')
    return hasActiveQueries || hasActiveMutations
  })
}
