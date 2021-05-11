import { useCallback, useEffect, useState } from 'preact/hooks'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] => {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
      return initialValue
    }
  }, [initialValue, key])

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T) => {
      try {
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(value))

        // Save state
        setStoredValue(value)

        // We dispatch a custom event so every useLocalStorage hook are notified
        window.dispatchEvent(new Event('local-storage'))
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error)
      }
    },
    [key]
  )

  const removeValue = useCallback(() => {
    // Remove from local storage
    window.localStorage.removeItem(key)

    // Save state as initial value
    setStoredValue(initialValue)

    // Dispatch custom event
    window.dispatchEvent(new Event('local-storage'))
  }, [initialValue, key])

  useEffect(() => {
    setStoredValue(readValue())
  }, [readValue])

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue())
    }

    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange)

    // this is a custom event, triggered in writeValueToLocalStorage
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
  }, [readValue])

  return [storedValue, setValue, removeValue]
}
