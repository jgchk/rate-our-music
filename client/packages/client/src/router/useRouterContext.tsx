import { FunctionComponent, createContext, h } from 'preact'
import { useCallback, useContext, useEffect, useState } from 'preact/hooks'

type RouterContext = {
  location: string
  push: (location: string) => void
}

const RouterContext = createContext<RouterContext>({
  location: window.location.pathname,
  push: () => {
    throw new Error('RouterContext must be used inside Router')
  },
})

export const RouterProvider: FunctionComponent = ({ children }) => {
  const [location, setLocation] = useState(window.location.pathname)

  const push = useCallback((newLocation: string) => {
    window.history.pushState({}, '', newLocation)
    setLocation(newLocation)
  }, [])

  useEffect(() => {
    const handler = () => setLocation(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return (
    <RouterContext.Provider value={{ location, push }}>
      {children}
    </RouterContext.Provider>
  )
}

export const useRouterContext = (): RouterContext => useContext(RouterContext)
