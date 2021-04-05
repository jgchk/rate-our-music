import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { Link } from '../../common/components/Link'
import pageClasses from '../ReleasePage.module.css'
import { RatingStars } from './RatingStars'
import classes from './ReviewWithText.module.css'

type UserProps = { id: number }

const User: FunctionComponent<UserProps> = ({ id }) => {
  const user = useSelector((state) => state.users[id])
  if (!user) return <div>No user found with id: {id}</div>
  return <Link href={`/user/${user.id}`}>{user.username}</Link>
}

export type ReviewWithTextProps = { id: number }

export const ReviewWithText: FunctionComponent<ReviewWithTextProps> = ({
  id,
}) => {
  const review = useSelector((state) => state.reviews[id])
  if (!review) return <div>No review found with id: {id}</div>
  return (
    <div className={pageClasses.section}>
      <div className={classes.header}>
        <User id={review.user} />
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}
