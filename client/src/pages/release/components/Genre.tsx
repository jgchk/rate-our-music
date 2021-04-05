import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { Link } from '../../common/components/Link'

export type Props = { id: number }

export const Genre: FunctionComponent<Props> = ({ id }) => {
  const genre = useSelector((state) => state.genres[id])
  if (!genre) return <div>No genre found with id: {id}</div>
  return <Link href={`/genre/${genre.id}`}>{genre.name}</Link>
}
