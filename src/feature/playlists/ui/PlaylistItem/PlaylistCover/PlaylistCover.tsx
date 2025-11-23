import s from '@/feature/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover.module.css'
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from '@/feature/playlists/api/playlistsApi.ts'
import type { ChangeEvent } from 'react'
import defaultCover from '@/assets/img/default-playlist-cover.png'
import type { Images } from '@/common/types'
import { errorToast } from '@/common/utils'

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const uploadCoverHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const allowedType = ['image/png', 'image/png', 'image/gif']
    const maxSize = 1024 * 1024

    const file = e.target.files?.length && e.target.files[0]
    if (!file) return

    if (!allowedType.includes(file.type)) {
      errorToast('uncorrected type')
      // toast('uncorrected type')
      return
    }

    if (maxSize < file.size) {
      errorToast('uncorrected size')
      // toast('uncorrected size')
      return
    }

    uploadPlaylistCover({
      playlistId,
      file,
    })
  }

  const deletePlaylistCoverHandler = () => {
    deletePlaylistCover({ playlistId })
  }

  const originalCover = images.main.find((img) => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover

  return (
    <>
      <img className={s.cover} src={src} alt="cover" />
      <input type="file" accept={'image/png,image/png,image/gif'} onChange={uploadCoverHandler} />
      {originalCover && <button onClick={deletePlaylistCoverHandler}>delete cover</button>}
    </>
  )
}
