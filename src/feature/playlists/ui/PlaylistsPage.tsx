import { useFetchPlaylistsQuery } from '@/feature/playlists/api/playlistsApi.ts'
import s from './PlaylistsPage.module.css'
import { CreatePlaylistForm } from '@/feature/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { type ChangeEvent, useState } from 'react'
import { useDebounceValue } from '@/common/hooks/useDebounceValue.ts'
import { Pagination } from '@/common/components'
import { PlaylistsList } from '@/feature/playlists/ui/PlaylistsList'

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const debounceValue = useDebounceValue(search)

  const { data, isLoading } = useFetchPlaylistsQuery({ search: debounceValue, pageNumber, pageSize })

  // useEffect(() => {
  //   if (error) {
  //     // toast(JSON.stringify(error.data), { type: 'error', theme: 'colored' })
  //     console.log(error)
  //
  //     if ('status' in error) {
  //       const errMsg =
  //         'error' in error
  //           ? error.error
  //           : (error.data as { error: string }).error ||
  //             (error.data as { message: string }).message ||
  //             JSON.stringify(error.data) ||
  //             'Some error  occurred'
  //
  //       toast(errMsg, { type: 'error', theme: 'colored' })
  //     } else {
  //       const errMsg = error.message || 'Some error occurred'
  //       toast(errMsg, { type: 'error', theme: 'colored' })
  //     }
  //   }
  // }, [error])

  const handelSetPageSize = (size: number) => {
    setPageNumber(1)
    setPageSize(size)
  }

  const handlerSetSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setPageNumber(1)
    setSearch(e.currentTarget.value)
  }

  if (isLoading) return <h1>Skeleton loader ...</h1>

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input type="search" placeholder={'Search playlist by title'} onChange={handlerSetSearch} />
      <div className={s.items}>
        {data?.data.length === 0 && <h3>Playlist not found</h3>}
        <PlaylistsList playlists={data?.data || []} />
      </div>
      <Pagination
        currentPage={pageNumber}
        pagesCount={data?.meta.pagesCount || 1}
        setCurrentPage={setPageNumber}
        changePageSize={handelSetPageSize}
        pageSize={pageSize}
      />
    </div>
  )
}
