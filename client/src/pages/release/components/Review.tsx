import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { RatingStars } from './RatingStars'
import classes from './Review.module.css'

export type Props = { id: number }

export const Review: FunctionComponent<Props> = ({ id }) => {
  const review = useSelector(
    (state) => state.releasePage.release?.reviews.byId[id]
  )

  if (!review) {
    return <></>
  }

  return (
    <div className={classes.container}>
      <a href={`/user/${review.user.id}`}>{review.user.username}</a>
      <RatingStars value={review.rating ?? 0} />
    </div>
  )
}