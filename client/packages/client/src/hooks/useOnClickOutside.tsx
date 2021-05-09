import { RefObject } from 'preact'
import { useEffect } from 'preact/hooks'

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClickOutside: () => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = ref?.current

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return
      }

      onClickOutside()
    }

    document.addEventListener('click', listener)

    return () => document.removeEventListener('click', listener)
  }, [onClickOutside, ref])
}
