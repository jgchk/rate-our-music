import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useGetPartialUserQuery } from '../generated/graphql'
import { build } from '../router/parser'
import { userRoute } from '../router/routes'
import { Link } from './Link'

export type Props = { id: number }

export const UserLink: FunctionComponent<Props> = ({ id }) => {
  const [{ data, fetching, error }] = useGetPartialUserQuery({
    variables: { id },
  })
  const user = useMemo(() => data?.account.get, [data?.account.get])
  const link = useMemo(() => build(userRoute)({ userId: id }), [id])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>No user found</div>

  return <Link href={link}>{user.username}</Link>
}
