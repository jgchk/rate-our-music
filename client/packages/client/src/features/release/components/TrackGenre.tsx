import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { Link } from '../../common/components/Link'
import { useGetTrackGenreAction } from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'
import { genreRoute } from '../../routing/routes'
import { build } from '../../routing/utils/parser'

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
