import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
  useUpdatePlaylistMutation,
} from '@/feature/playlists/api/playlistsApi.ts'
import s from './PlaylistsPage.module.css'
import { CreatePlaylistForm } from '@/feature/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { useState } from 'react'
import type { PlaylistData, UpdatePlaylistArgs } from '@/feature/playlists/api/PlaylistsApi.types.ts'
import { type SubmitHandler, useForm } from 'react-hook-form'

export const PlaylistsPage = () => {
  const { data } = useFetchPlaylistsQuery()
  const [deletePlaylist] = useDeletePlaylistMutation()
  const [updatePlaylist] = useUpdatePlaylistMutation()

  const [playlistId, setPlaylistId] = useState<null | string | undefined>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId)
    }
  }

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

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!playlistId) return
    updatePlaylist({ playlistId, args: data }).then(() => {
      setPlaylistId(null)
    })
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
              ) : (
                <div>
                  <div>title: {playlist.attributes.title}</div>
                  <div>description: {playlist.attributes.description}</div>
                  <div>userName: {playlist.attributes.user.name}</div>
                  <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
                  <button onClick={() => editPlaylistHandler(playlist)}>update</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
