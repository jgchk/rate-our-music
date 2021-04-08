import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useGetTrackAction } from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'
import { Link } from '../../routing/components/Link'
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
  id: number
  index: number
}

export const Track: FunctionComponent<Props> = ({ id, index }) => {
  const track = useSelector((state) => state.tracks[id])

  const [getTrack, getTrackAction] = useGetTrackAction()
  useEffect(() => {
    if (track === undefined || track.id !== id) {
      getTrack(id)
    }
  }, [getTrack, id, track])

  if (getTrackAction && isLoading(getTrackAction.request)) {
    return <div>Loading...</div>
  }
  if (!track) return <div>No track found with id: {id}</div>

  return (
    <Link className={classes.container} href={`/track/${id}`}>
      <div className={classes.num}>{index + 1}</div>
      <div className={classes.title}>{track.title}</div>
      <div className={classes.duration}>
        {track.durationMs && formatTime(track.durationMs)}
      </div>
    </Link>
  )
}
