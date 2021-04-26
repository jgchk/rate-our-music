import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { Link } from '../../common/components/Link'
import { useGetArtistAction } from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'

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
    <Link className='font-lg' href={`/artist/${artist.id}`}>
      {artist.name}
    </Link>
  )
}
