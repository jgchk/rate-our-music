import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import {
  useGetReleaseReviewAction,
  useGetTrackReviewAction,
} from '../../common/hooks/useAction'
import { useSelector } from '../../common/state/store'
import { isLoading } from '../../common/utils/remote-data'
import { RatingStars } from './RatingStars'
import { UserLink } from './UserLink'

export type Props = {
  id: number
}

export const ReleaseReviewWithText: FunctionComponent<Props> = ({ id }) => {
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
    <div>
      <div className='flex align-center justify-between'>
        <UserLink id={review.user} />
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}

export const TrackReviewWithText: FunctionComponent<Props> = ({ id }) => {
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
    <div>
      <div className='flex align-center justify-between'>
        <UserLink id={review.user} />
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}
