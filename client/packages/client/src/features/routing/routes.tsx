import { VNode, h } from 'preact'
import { LoginPage } from '../auth/pages/LoginPage'
import { LogoutPage } from '../auth/pages/LogoutPage'
import { pipe } from '../common/utils/pipe'
import { ReleasePage } from '../release/pages/ReleasePage'
import { TrackPage } from '../release/pages/TrackPage'
import { Matcher, extend, int, match, param, route } from './utils/parser'

export const loginRoute = pipe(route(), extend('login'))
export const logoutRoute = pipe(route(), extend('logout'))
export const userRoute = pipe(route(), extend('user'), param('userId', int))
export const releaseRoute = pipe(
  route(),
  extend('release'),
  param('releaseId', int)
)
export const trackRoute = pipe(route(), extend('track'), param('trackId', int))
export const artistRoute = pipe(
  route(),
  extend('artist'),
  param('artistId', int)
)
export const genreRoute = pipe(route(), extend('genre'), param('genreId', int))

const matcher = <P,>(matcher: Matcher<P>, view: (params: P) => VNode) =>
  [matcher, view] as const

export const routes = [
  matcher(match(loginRoute), () => <LoginPage />),
  matcher(match(logoutRoute), () => <LogoutPage />),
  matcher(match(releaseRoute), (params) => (
    <ReleasePage releaseId={params.releaseId} />
  )),
  matcher(match(trackRoute), (params) => (
    <TrackPage trackId={params.trackId} />
  )),
] as const
