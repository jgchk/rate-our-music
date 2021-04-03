import { createContext } from 'preact'

export type RouterContext = {
  location: string
  push: (location: string) => void
}

export const RouterContext = createContext<RouterContext>({
  location: window.location.pathname,
  push: () => {
    throw new Error('RouterContext must be used inside Router')
  },
})
