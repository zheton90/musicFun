import { useGetMeQuery } from '@/feature/auth/api/authApi.ts'
import { PlaylistsList } from '@/feature/playlists/ui/PlaylistsList'
import { useFetchPlaylistsQuery } from '@/feature/playlists/api/playlistsApi.ts'
import { CreatePlaylistForm } from '@/feature/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import s from './ProfilePage.module.css'
import { Navigate } from 'react-router'
import { Path } from '@/common/routing'

export const ProfilePage = () => {
  const { data: meData, isLoading: isMeLoading } = useGetMeQuery()
  const { data: PlaylistData, isLoading } = useFetchPlaylistsQuery(
    { userId: meData?.userId },
    { skip: !meData?.userId },
  )

  if (isLoading || isMeLoading) return <h1>Skeleton loader ...</h1>
  if (!isMeLoading && !meData) return <Navigate to={Path.Playlists} />

  return (
    <div>
      <h1>Profile page</h1>
      <div>login: {meData?.login}</div>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistsList playlists={PlaylistData?.data || []} />
      </div>
    </div>
  )
}
