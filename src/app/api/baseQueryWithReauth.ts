import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { baseQuery } from '@/app/api/baseQuery.ts'
import { handleErrors } from '@/common/utils'

// create a new mutex
const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
        if (refreshResult.data) {
          // api.dispatch(tokenReceived(refreshResult.data))   !!!!
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          // api.dispatch(loggedOut())  !!!!!
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  if (result.error && result.error.status !== 401) {
    handleErrors(result.error)
  }

  return result
}
