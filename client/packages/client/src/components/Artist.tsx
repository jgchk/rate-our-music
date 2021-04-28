import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useGetArtistAction } from '../hooks/useAction'
import { build } from '../router/parser'
import { artistRoute } from '../router/routes'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Link } from './Link'

export type Props = { id: number }

export const Artist: FunctionComponent<Props> = ({ id }) => {
  const artist = useSelector((state) => state.artists[id])

  const [getArtist, getArtistAction] = useGetArtistAction()
  useEffect(() => {
    if (artist === undefined || artist.id !== id) {
      getArtist(id)
    }
  }, [artist, getArtist, id])

  const artistLink = useMemo(() => build(artistRoute)({ artistId: id }), [id])

  if (getArtistAction && isLoading(getArtistAction.request)) {
    return <div>Loading...</div>
  }
  if (!artist) return <div>No artist found with id: {id}</div>

  return (
    <Link className='font-lg' href={artistLink}>
      {artist.name}
    </Link>
  )
}
