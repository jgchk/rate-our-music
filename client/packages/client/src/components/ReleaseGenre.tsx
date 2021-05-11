import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useGetGenreQuery } from '../generated/graphql'
import { build } from '../router/parser'
import { genreRoute } from '../router/routes'
import { Link } from './Link'

export type Props = {
  id: number
}

export const ReleaseGenre: FunctionComponent<Props> = ({ id }) => {
  const [{ data, fetching, error }] = useGetGenreQuery({
    variables: { id },
  })
  const genre = useMemo(() => data?.genre.get, [data?.genre.get])
  const link = useMemo(() => build(genreRoute)({ genreId: id }), [id])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!genre) return <div>No genre found</div>

  return <Link href={link}>{genre.name}</Link>
}
