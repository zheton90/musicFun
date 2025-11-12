import { useEffect, useState } from 'react'

export const useDebounceValue = <T>(value: T, delay: number = 700): T => {
  const [debounce, setDebounce] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounce(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounce
}
