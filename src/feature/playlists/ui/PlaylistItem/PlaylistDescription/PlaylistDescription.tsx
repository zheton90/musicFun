import type { PlaylistData } from '@/feature/playlists/api/PlaylistsApi.types.ts'

type Props = {
  playlist: PlaylistData
}

export const PlaylistDescription = ({ playlist }: Props) => {
  return (
    <>
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
    </>
  )
}
