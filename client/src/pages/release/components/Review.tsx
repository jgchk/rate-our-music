import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from '../../../state/store'
import { isLoading } from '../../../utils/remote-data'
import { Link } from '../../common/components/Link'
import {
  useGetReleaseReviewAction,
  useGetTrackReviewAction,
} from '../hooks/useAction'
import { RatingStars } from './RatingStars'
import classes from './Review.module.css'

type UserProps = { id: number }

const User: FunctionComponent<UserProps> = ({ id }) => {
  const user = useSelector((state) => state.users[id])
  if (!user) return <div>No user found with id: {id}</div>
  return <Link href={`/user/${user.id}`}>{user.username}</Link>
}

export type ReviewProps = {
  id: number
}

export const ReleaseReview: FunctionComponent<ReviewProps> = ({ id }) => {
  const review = useSelector((state) => state.releaseReviews[id])

  const [getReleaseReview, getReleaseReviewAction] = useGetReleaseReviewAction()
  useEffect(() => {
    if (review === undefined || review.id !== id) {
      getReleaseReview(id)
    }
  }, [getReleaseReview, id, review])

  if (getReleaseReviewAction && isLoading(getReleaseReviewAction.request)) {
    return <div>Loading...</div>
  }
  if (!review) return <div>No review found with id: {id}</div>

  return (
    <div className={classes.container}>
      <User id={review.user} />
      <RatingStars value={review.rating ?? 0} />
    </div>
  )
}

export const TrackReview: FunctionComponent<ReviewProps> = ({ id }) => {
  const review = useSelector((state) => state.trackReviews[id])

  const [getTrackReview, getTrackReviewAction] = useGetTrackReviewAction()
  useEffect(() => {
    if (review === undefined || review.id !== id) {
      getTrackReview(id)
    }
  }, [getTrackReview, id, review])

  if (getTrackReviewAction && isLoading(getTrackReviewAction.request)) {
    return <div>Loading...</div>
  }
  if (!review) return <div>No review found with id: {id}</div>

  return (
    <div className={classes.container}>
      <User id={review.user} />
      <RatingStars value={review.rating ?? 0} />
    </div>
  )
}
