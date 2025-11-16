import { useFetchTracksInfiniteQuery } from '@/feature/tracks/api/tracksApi.ts'
import s from './TracksPage.module.css'
import { useEffect, useRef } from 'react'

export const TracksPage = () => {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()
  console.log(data, hasNextPage)

  const observerRef = useRef<HTMLDivElement>(null)

  const pages = data?.pages.map((page) => page.data).flat() || []

  const loadMoreHandler = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        root: null,
      },
    )

    const currentObserveRef = observerRef.current

    if (currentObserveRef) {
      observer.observe(currentObserveRef)
    }

    return () => {
      if (currentObserveRef) {
        observer.unobserve(currentObserveRef)
      }
    }
  }, [loadMoreHandler])

  return (
    <div>
      <h1>Tracks page</h1>
      <div className={s.list}>
        {pages.map((track) => {
          const { title, user, attachments } = track.attributes

          return (
            <div key={track.id} className={s.item}>
              <div>
                <p>Title: {title}</p>
                <p>Name: {user.name}</p>
              </div>
              {attachments.length ? <audio controls src={attachments[0].url} /> : 'no file'}
            </div>
          )
        })}
      </div>
      {/*загрузка по кнопке*/}
      {/*{!isLoading && (*/}
      {/*  <>*/}
      {/*    {hasNextPage ? (*/}
      {/*      <button onClick={loadMoreHandler} disabled={isFetching}>*/}
      {/*        {isFetchingNextPage ? 'Loading...' : 'Load More'}*/}
      {/*      </button>*/}
      {/*    ) : (*/}
      {/*      <p>Nothing more to load</p>*/}
      {/*    )}*/}
      {/*  </>*/}
      {/*)}*/}
      {hasNextPage && (
        <div ref={observerRef}>{isFetchingNextPage ? <div> Loading... </div> : <div style={{ height: '20px' }} />}</div>
      )}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
