import { useDeletePlaylistMutation } from '@/feature/playlists/api/playlistsApi.ts'
import type { PlaylistData } from '@/feature/playlists/api/PlaylistsApi.types.ts'
import { PlaylistCover } from '@/feature/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover.tsx'
import { PlaylistDescription } from '@/feature/playlists/ui/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx'

type Props = {
  playlist: PlaylistData
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylistHandler }: Props) => {
  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId)
    }
  }

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />

      <PlaylistDescription playlist={playlist} />

      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </div>
  )
}
