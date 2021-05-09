import { useEffect, useState } from 'preact/hooks'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== debouncedValue) {
        setDebouncedValue(value)
      }
    }, delay)
    return () => clearTimeout(timeout)
  }, [debouncedValue, delay, value])

  return debouncedValue
}
