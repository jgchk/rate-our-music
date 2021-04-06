import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from '../../../state/store'
import { isLoading } from '../../../utils/remote-data'
import { Link } from '../../common/components/Link'
import { useGetArtistAction } from '../hooks/useGetArtistAction'
import classes from './Artist.module.css'

export type Props = { id: number }

export const Artist: FunctionComponent<Props> = ({ id }) => {
  const artist = useSelector((state) => state.artists[id])

  const [getArtist, getArtistAction] = useGetArtistAction()
  useEffect(() => {
    if (artist === undefined || artist.id !== id) {
      getArtist(id)
    }
  }, [artist, getArtist, id])

  if (getArtistAction && isLoading(getArtistAction.request)) {
    return <div>Loading...</div>
  }
  if (!artist) return <div>No artist found with id: {id}</div>

  return (
    <Link className={classes.artist} href={`/artist/${artist.id}`}>
      {artist.name}
    </Link>
  )
}
