import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useGetArtistQuery } from '../generated/graphql'
import { build } from '../router/parser'
import { artistRoute } from '../router/routes'
import { Link } from './Link'

export type Props = { id: number }

export const Artist: FunctionComponent<Props> = ({ id }) => {
  const [{ data, fetching, error }] = useGetArtistQuery({
    variables: { id },
  })
  const artist = useMemo(() => data?.artist.get, [data?.artist.get])
  const link = useMemo(() => build(artistRoute)({ artistId: id }), [id])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!artist) return <div>No artist found</div>

  return <Link href={link}>{artist.name}</Link>
}
