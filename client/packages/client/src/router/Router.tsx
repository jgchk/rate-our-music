import { FunctionComponent, h } from 'preact'
import { findMap } from '../utils/array'
import { routes } from './routes'
import { useRouterContext } from './useRouterContext'

export const Router: FunctionComponent = () => {
  const { location } = useRouterContext()

  const view = findMap(routes, ([matcher, view]) => {
    const params = matcher(location)
    if (params) return view(params as never)
  })

  return view === undefined ? <div>404</div> : view
}
