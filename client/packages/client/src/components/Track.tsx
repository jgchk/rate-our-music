import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useGetPartialTrackQuery } from '../generated/graphql'
import { build } from '../router/parser'
import { trackRoute } from '../router/routes'
import { isSome } from '../utils/types'
import { Link } from './Link'

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
  const [{ data, fetching, error }] = useGetPartialTrackQuery({
    variables: { id },
  })
  const track = useMemo(() => data?.track.get, [data?.track.get])
  const link = useMemo(() => build(trackRoute)({ trackId: id }), [id])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!track) return <div>No track found</div>

  return (
    <Link className='flex p-3' href={link}>
      <div className='flex-1'>{index + 1}</div>
      <div className={track.durationMs === undefined ? 'flex-16' : 'flex-15'}>
        {track.title}
      </div>
      <div className='flex-1 text-right'>
        {isSome(track.durationMs) && formatTime(track.durationMs)}
      </div>
    </Link>
  )
}
