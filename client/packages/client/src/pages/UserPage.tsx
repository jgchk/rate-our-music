import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { ReleaseReview } from '../components/ReleaseReview'
import { useGetFullUserQuery } from '../generated/graphql'

export type Props = {
  userId: number
}

export const UserPage: FunctionComponent<Props> = ({ userId }) => {
  const [{ data, fetching, error }] = useGetFullUserQuery({
    variables: { id: userId },
  })
  const user = useMemo(() => data?.account.get, [data?.account.get])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>No user found</div>

  return (
    <div>
      <div>{user.username}</div>
      <div>
        {user.releaseReviews.map(({ id }) => (
          <ReleaseReview key={id} id={id} />
        ))}
      </div>
    </div>
  )
}
