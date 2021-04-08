import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { findMap } from '../../common/utils/array'
import { RouterContext } from '../contexts/RouterContext'
import { routes } from '../routes'

export const Router: FunctionComponent = () => {
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

  const view = findMap(routes, ([matcher, view]) => {
    const params = matcher(window.location.pathname)
    if (params) return view(params as never)
  })

  return (
    <RouterContext.Provider value={{ location, push }}>
      {view === undefined ? <div>404</div> : view}
    </RouterContext.Provider>
  )
}
