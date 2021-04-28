import { VNode, h } from 'preact'
import { LoginPage } from '../auth/pages/LoginPage'
import { LogoutPage } from '../auth/pages/LogoutPage'
import { pipe } from '../common/utils/pipe'
import { ReleasePage } from '../release/pages/ReleasePage'
import { TrackPage } from '../release/pages/TrackPage'
import { Matcher, extend, int, match, param, route } from './utils/parser'

const loginRoute = pipe(route(), extend('login'))
const logoutRoute = pipe(route(), extend('logout'))
const releaseRoute = pipe(route(), extend('release'), param('releaseId', int))
const releaseTrackRoute = pipe(route(), extend('track'), param('trackId', int))

const matcher = <P,>(matcher: Matcher<P>, view: (params: P) => VNode) =>
  [matcher, view] as const

export const routes = [
  matcher(match(loginRoute), () => <LoginPage />),
  matcher(match(logoutRoute), () => <LogoutPage />),
  matcher(match(releaseRoute), (params) => (
    <ReleasePage releaseId={params.releaseId} />
  )),
  matcher(match(releaseTrackRoute), (params) => (
    <TrackPage trackId={params.trackId} />
  )),
] as const
