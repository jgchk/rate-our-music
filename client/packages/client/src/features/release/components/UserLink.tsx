import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { Link } from '../../common/components/Link'
import { useGetUserAction } from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'
import { userRoute } from '../../routing/routes'
import { build } from '../../routing/utils/parser'

export type Props = { id: number }

export const UserLink: FunctionComponent<Props> = ({ id }) => {
  const user = useSelector((state) => state.users[id])

  const [getUser, getUserAction] = useGetUserAction()
  useEffect(() => {
    if (user === undefined || user.id !== id) {
      getUser(id)
    }
  }, [getUser, id, user])

  const userLink = useMemo(() => build(userRoute)({ userId: id }), [id])

  if (getUserAction && isLoading(getUserAction.request)) {
    return <div>Loading...</div>
  }
  if (!user) return <div>No user found with id: {id}</div>

  return <Link href={userLink}>{user.username}</Link>
}
