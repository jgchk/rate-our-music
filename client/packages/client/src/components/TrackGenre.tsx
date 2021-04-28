import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useGetTrackGenreAction } from '../hooks/useAction'
import { build } from '../router/parser'
import { genreRoute } from '../router/routes'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Link } from './Link'

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

  const genreLink = useMemo(() => build(genreRoute)({ genreId: id }), [id])

  if (getTrackGenreAction && isLoading(getTrackGenreAction.request)) {
    return <div>Loading...</div>
  }
  if (!genre) {
    return <div>No genre found with id: {id}</div>
  }

  return <Link href={genreLink}>{genre.name}</Link>
}
