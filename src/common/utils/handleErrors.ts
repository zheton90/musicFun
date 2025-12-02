import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toast } from 'react-toastify'
import { isErrorWithProperty } from '@/common/utils/isErrorWithProperty.ts'
import { isErrorWithDetailArray } from '@/common/utils/isErrorWithDetailArray.ts'
import { trimToMaxLength } from '@/common/utils/trimToMaxLength.ts'
import { errorToast } from '@/common/utils/errorToast.ts'

export const handleErrors = (error: FetchBaseQueryError) => {
  if (error) {
    switch (error.status) {
      case 'CUSTOM_ERROR':
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'TIMEOUT_ERROR':
        toast(error.error, { type: 'error', theme: 'colored' })
        break
      case 404:
        if (isErrorWithProperty(error.data, 'error')) {
          errorToast(error.data.error)
        } else {
          errorToast(JSON.stringify(error.data))
          // toast(JSON.stringify(error.data), { type: 'error', theme: 'colored' })
        }
        break

      case 429:
        if (isErrorWithProperty(error.data, 'message')) {
          errorToast(error.data.message)
          // toast(error.data.message, { type: 'error', theme: 'colored' })
        } else {
          errorToast(JSON.stringify(error.data))
          // toast(JSON.stringify(error.data), { type: 'error', theme: 'colored' })
        }

        break

      case 403:
      case 400:
        if (isErrorWithDetailArray(error.data)) {
          errorToast(trimToMaxLength(error.data.errors[0].detail))
          // toast(trimToMaxLength(error.data.errors[0].detail), { type: 'error', theme: 'colored' })
        } else {
          errorToast(JSON.stringify(error.data))
          // toast(JSON.stringify(error.data), { type: 'error', theme: 'colored' })
        }
        break

      default:
        if (error.status >= 500 && error.status < 600) {
          errorToast('Server error occurred. Please try again later.')
          // toast('Server error occurred. Please try again later.', { type: 'error', theme: 'colored' })
        } else {
          errorToast('Some error occurred')
          // toast('Some error occurred', { type: 'error', theme: 'colored' })
        }
    }
  }
}
