import { VNode } from 'preact'
import { ReleasePage } from '../pages/release/ReleasePage'
import { pipe } from '../utils/pipe'
import { Matcher, extend, int, match, param, route } from './parser'

const releaseRoute = pipe(route(), extend('release'), param('releaseId', int))
const releaseTrackRoute = pipe(
  releaseRoute,
  extend('track'),
  param('trackId', int)
)

const matchView = <P,>(matcher: Matcher<P>, view: (params: P) => VNode) =>
  [matcher, view] as const

export const routes = [
  matchView(match(releaseRoute), (params) => (
    <ReleasePage releaseId={params.releaseId} />
  )),
  matchView(match(releaseTrackRoute), (params) => (
    <ReleasePage releaseId={params.releaseId} trackId={params.trackId} />
  )),
] as const
