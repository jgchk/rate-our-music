import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { Link } from '../../common/components/Link'
import { useGetReleaseGenreAction } from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'
import { genreRoute } from '../../routing/routes'
import { build } from '../../routing/utils/parser'

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
