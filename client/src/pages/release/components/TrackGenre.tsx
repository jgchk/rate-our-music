import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from '../../../state/store'
import { isLoading } from '../../../utils/remote-data'
import { Link } from '../../common/components/Link'
import { useGetTrackGenreAction } from '../hooks/useAction'

export type Props = {
  id: number
  trackId: number
}

export const TrackGenre: FunctionComponent<Props> = ({ id, trackId }) => {
  const genre = useSelector((state) => state.genres[id])

  const [getTrackGenre, getTrackGenreAction] = useGetTrackGenreAction()
  useEffect(() => {
    if (genre === undefined || genre.id !== id) {
      getTrackGenre(id, trackId)
    }
  }, [genre, getTrackGenre, id, trackId])

  if (getTrackGenreAction && isLoading(getTrackGenreAction.request)) {
    return <div>Loading...</div>
  }
  if (!genre) {
    return <div>No genre found with id: {id}</div>
  }

  return <Link href={`/genre/${genre.id}`}>{genre.name}</Link>
}
