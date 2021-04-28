import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { ReleaseReview } from '../components/ReleaseReview'
import { useGetFullUserAction } from '../hooks/useAction'
import { isFullUser } from '../state/slices/users'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'

export type Props = {
  userId: number
}

export const UserPage: FunctionComponent<Props> = ({ userId }) => {
  const user = useSelector((state) => state.users[userId])

  const [getFullUser, getFullUserAction] = useGetFullUserAction()
  useEffect(() => {
    if (user === undefined || user.id !== userId || !isFullUser(user)) {
      getFullUser(userId)
    }
  }, [getFullUser, user, userId])

  if (!user) {
    return <div>No user found with id: {userId}</div>
  }
  if (
    (getFullUserAction && isLoading(getFullUserAction.request)) ||
    !isFullUser(user)
  ) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>{user.username}</div>
      <div>
        {[...user.releaseReviews].map((id) => (
          <ReleaseReview key={id} id={id} />
        ))}
      </div>
    </div>
  )
}
