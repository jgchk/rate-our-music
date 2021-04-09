import { VNode, h } from 'preact'
import { pipe } from '../common/utils/pipe'
import { ReleasePage } from '../release/pages/ReleasePage'
import { TrackPage } from '../release/pages/TrackPage'
import { Matcher, extend, int, match, param, route } from './utils/parser'

const releaseRoute = pipe(route(), extend('release'), param('releaseId', int))
const releaseTrackRoute = pipe(route(), extend('track'), param('trackId', int))

const matchView = <P,>(matcher: Matcher<P>, view: (params: P) => VNode) =>
  [matcher, view] as const

export const routes = [
  matchView(match(releaseRoute), (params) => (
    <ReleasePage releaseId={params.releaseId} />
  )),
  matchView(match(releaseTrackRoute), (params) => (
    <TrackPage trackId={params.trackId} />
  )),
] as const
