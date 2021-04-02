import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { RatingStars } from './RatingStars'
import classes from './ReviewWithText.module.css'

export type Props = { id: number }

export const ReviewWithText: FunctionComponent<Props> = ({ id }) => {
  const review = useSelector(
    (state) => state.releasePage.release?.reviews.byId[id]
  )

  if (!review) {
    return <></>
  }

  return (
    <div>
      <div className={classes.header}>
        <a href={`/user/${review.user.id}`}>{review.user.username}</a>
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}
