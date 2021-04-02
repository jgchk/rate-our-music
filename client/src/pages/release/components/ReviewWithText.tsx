import { FunctionComponent } from 'preact'
import { useSelector } from '../../../state/store'
import { Link } from '../../common/components/Link'
import pageClasses from '../ReleasePage.module.css'
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
    <div className={pageClasses.section}>
      <div className={classes.header}>
        <Link href={`/user/${review.user.id}`}>{review.user.username}</Link>
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}
