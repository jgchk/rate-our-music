import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useGetTrackAction } from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'
import { Link } from '../../routing/components/Link'

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
    <Link className='flex p-3' href={`/track/${id}`}>
      <div className='flex-1'>{index + 1}</div>
      <div className={track.durationMs === undefined ? 'flex-16' : 'flex-15'}>
        {track.title}
      </div>
      <div className='flex-1 text-right'>
        {track.durationMs !== undefined && formatTime(track.durationMs)}
      </div>
    </Link>
  )
}
