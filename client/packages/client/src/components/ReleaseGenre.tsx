import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useGetReleaseGenreAction } from '../hooks/useAction'
import { build } from '../router/parser'
import { genreRoute } from '../router/routes'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Link } from './Link'

export type Props = {
  id: number
  releaseId: number
}

export const ReleaseGenre: FunctionComponent<Props> = ({ id, releaseId }) => {
  const genre = useSelector((state) => state.genres[id])

  const [getReleaseGenre, getReleaseGenreAction] = useGetReleaseGenreAction()
  useEffect(() => {
    if (genre === undefined || genre.id !== id) {
      getReleaseGenre(id, releaseId)
    }
  }, [genre, getReleaseGenre, id, releaseId])

  const genreLink = useMemo(() => build(genreRoute)({ genreId: id }), [id])

  if (getReleaseGenreAction && isLoading(getReleaseGenreAction.request)) {
    return <div>Loading...</div>
  }
  if (!genre) {
    return <div>No genre found with id: {id}</div>
  }

  return <Link href={genreLink}>{genre.name}</Link>
}
