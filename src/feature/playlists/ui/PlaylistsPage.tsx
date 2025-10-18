import { useFetchPlaylistsQuery } from '@/feature/playlists/api/playlistsApi.ts'
import s from './PlaylistsPage.module.css'
import { CreatePlaylistForm } from '@/feature/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { useState } from 'react'
import type { PlaylistData, UpdatePlaylistArgs } from '@/feature/playlists/api/PlaylistsApi.types.ts'
import { useForm } from 'react-hook-form'
import { EditPlaylistForm } from '@/feature/playlists/ui/EditPlaylistForm/EditPlaylistForm.tsx'
import { PlaylistItem } from '@/feature/playlists/ui/PlaylistItem/PlaylistItem.tsx'

export const PlaylistsPage = () => {
  const { data } = useFetchPlaylistsQuery()

  const [playlistId, setPlaylistId] = useState<null | string>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist?.id)
      reset({
        title: playlist?.attributes.title,
        description: playlist?.attributes.description,
        tagIds: playlist?.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
          const isEditing = playlistId === playlist.id

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  register={register}
                  handleSubmit={handleSubmit}
                  playlistId={playlist.id}
                  editPlaylistHandler={editPlaylistHandler}
                  setPlaylistId={setPlaylistId}
                />
              ) : (
                <PlaylistItem playlist={playlist} editPlaylistHandler={editPlaylistHandler} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
