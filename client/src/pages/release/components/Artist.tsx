import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { Link } from '../../common/components/Link'
import classes from './Artist.module.css'

export type Props = { id: number }

export const Artist: FunctionComponent<Props> = ({ id }) => {
  const artist = useSelector((state) => state.artists[id])
  if (!artist) return <div>No artist found with id: {id}</div>
  return (
    <Link className={classes.artist} href={`/artist/${artist.id}`}>
      {artist.name}
    </Link>
  )
}
