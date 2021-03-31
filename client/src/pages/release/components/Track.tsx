import { FunctionComponent } from 'preact'
import { Track as TrackModel } from '../../../state'
import classes from './Track.module.css'

const padTime = (n: number) => n.toString().padStart(2, '0')
const formatTime = (ms: number) => {
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const HOUR = 60 * MINUTE

  const hours = Math.floor(ms / HOUR)
  const minutes = Math.floor((ms - hours * HOUR) / MINUTE)
  const seconds = Math.round((ms - hours * HOUR - minutes * MINUTE) / SECOND)

  return hours > 0
    ? `${hours}:${padTime(minutes)}:${padTime(seconds)}`
    : `${minutes}:${padTime(seconds)}`
}

export type Props = {
  track: TrackModel
  index: number
}

export const Track: FunctionComponent<Props> = ({ track, index }) => (
  <div className={classes.container}>
    <div className={classes.num}>{index + 1}</div>
    <div className={classes.title}>{track.title}</div>
    <div className={classes.duration}>{formatTime(track.duration)}</div>
  </div>
)
