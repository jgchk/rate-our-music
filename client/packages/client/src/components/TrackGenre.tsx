import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useGetGenreAction } from '../hooks/useAction'
import { build } from '../router/parser'
import { genreRoute } from '../router/routes'
import { TrackGenre as TrackGenreModel } from '../state/slices/tracks'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Link } from './Link'

export type Props = {
  trackGenre: TrackGenreModel
}

export const TrackGenre: FunctionComponent<Props> = ({
  trackGenre: { genreId },
}) => {
  const genre = useSelector((state) => state.genres.genres[genreId])

  const [getGenre, getGenreAction] = useGetGenreAction()
  useEffect(() => {
    if (genre === undefined || genre.id !== genreId) {
      getGenre(genreId)
    }
  }, [genre, genreId, getGenre])

  const genreLink = useMemo(() => build(genreRoute)({ genreId }), [genreId])

  if (getGenreAction && isLoading(getGenreAction.request)) {
    return <div>Loading...</div>
  }
  if (!genre) {
    return <div>No genre found with id: {genreId}</div>
  }

  return <Link href={genreLink}>{genre.name}</Link>
}
