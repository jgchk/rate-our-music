import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from '../../../state/store'
import { isLoading } from '../../../utils/remote-data'
import { Link } from '../../common/components/Link'
import { useGetReleaseGenreAction } from '../hooks/useAction'

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

  if (getReleaseGenreAction && isLoading(getReleaseGenreAction.request)) {
    return <div>Loading...</div>
  }
  if (!genre) {
    return <div>No genre found with id: {id}</div>
  }

  return <Link href={`/genre/${genre.id}`}>{genre.name}</Link>
}