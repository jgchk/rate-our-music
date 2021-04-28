import { VNode, h } from 'preact'
import { LoginPage } from '../pages/LoginPage'
import { LogoutPage } from '../pages/LogoutPage'
import { ReleasePage } from '../pages/ReleasePage'
import { TrackPage } from '../pages/TrackPage'
import { UserPage } from '../pages/UserPage'
import { pipe } from '../utils/pipe'
import { Matcher, extend, int, match, param, route } from './parser'

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
  matcher(match(userRoute), (params) => <UserPage userId={params.userId} />),
  matcher(match(releaseRoute), (params) => (
    <ReleasePage releaseId={params.releaseId} />
  )),
  matcher(match(trackRoute), (params) => (
    <TrackPage trackId={params.trackId} />
  )),
] as const
