import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from '../../../state/store'
import { isLoading } from '../../../utils/remote-data'
import {
  useGetReleaseReviewAction,
  useGetTrackReviewAction,
} from '../hooks/useAction'
import { RatingStars } from './RatingStars'
import classes from './Review.module.css'
import { UserLink } from './UserLink'

export type Props = {
  id: number
}

export const ReleaseReview: FunctionComponent<Props> = ({ id }) => {
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
      <UserLink id={review.user} />
      <RatingStars value={review.rating ?? 0} />
    </div>
  )
}

export const TrackReview: FunctionComponent<Props> = ({ id }) => {
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
      <UserLink id={review.user} />
      <RatingStars value={review.rating ?? 0} />
    </div>
  )
}
