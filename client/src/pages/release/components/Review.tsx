import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { Link } from '../../common/components/Link'
import { RatingStars } from './RatingStars'
import classes from './Review.module.css'

type UserProps = { id: number }

const User: FunctionComponent<UserProps> = ({ id }) => {
  const user = useSelector((state) => state.users[id])
  if (!user) return <div>No user found with id: {id}</div>
  return <Link href={`/user/${user.id}`}>{user.username}</Link>
}

export type ReviewProps = {
  kind: 'release' | 'track'
  id: number
}

export const Review: FunctionComponent<ReviewProps> = ({ kind, id }) => {
  const review = useSelector((state) => state.reviews[kind][id])
  if (!review) return <div>No review found with id: {id}</div>
  return (
    <div className={classes.container}>
      <User id={review.user} />
      <RatingStars value={review.rating ?? 0} />
    </div>
  )
}
