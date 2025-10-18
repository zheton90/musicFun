import type { SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import type { UpdatePlaylistArgs } from '@/feature/playlists/api/PlaylistsApi.types.ts'
import { useUpdatePlaylistMutation } from '@/feature/playlists/api/playlistsApi.ts'

type Props = {
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  playlistId: string
  editPlaylistHandler: (playlist: null) => void
  setPlaylistId: (playlistId: null) => void
}

export const EditPlaylistForm = ({ register, handleSubmit, playlistId, editPlaylistHandler, setPlaylistId }: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation()

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!playlistId) return
    updatePlaylist({ playlistId, args: data }).then(() => {
      setPlaylistId(null)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylistHandler(null)}>
        cancel
      </button>
    </form>
  )
}
