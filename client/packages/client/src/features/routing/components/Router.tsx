import { FunctionComponent, h } from 'preact'
import { useCallback, useContext, useEffect, useState } from 'preact/hooks'
import { findMap } from '../../common/utils/array'
import { RouterContext } from '../contexts/RouterContext'
import { routes } from '../routes'

export const Router: FunctionComponent = () => {
  const { location } = useContext(RouterContext)

  const view = findMap(routes, ([matcher, view]) => {
    const params = matcher(location)
    if (params) return view(params as never)
  })

  return view === undefined ? <div>404</div> : view
}

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
