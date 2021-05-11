import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import {
  useGetReleaseReviewQuery,
  useGetTrackReviewQuery,
} from '../generated/graphql'
import { RatingStars } from './RatingStars'
import { UserLink } from './UserLink'

export type Props = {
  id: number
}

export const ReleaseReviewWithText: FunctionComponent<Props> = ({ id }) => {
  const [{ data, fetching, error }] = useGetReleaseReviewQuery({
    variables: { id },
  })
  const review = useMemo(() => data?.releaseReview.get, [
    data?.releaseReview.get,
  ])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!review) return <div>No review found</div>

  return (
    <div>
      <div className='flex align-center justify-between'>
        <UserLink id={review.account.id} />
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}

export const TrackReviewWithText: FunctionComponent<Props> = ({ id }) => {
  const [{ data, fetching, error }] = useGetTrackReviewQuery({
    variables: { id },
  })
  const review = useMemo(() => data?.trackReview.get, [data?.trackReview.get])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!review) return <div>No review found</div>

  return (
    <div>
      <div className='flex align-center justify-between'>
        <UserLink id={review.account.id} />
        <RatingStars value={review.rating ?? 0} />
      </div>
      <div>{review.text ?? ''}</div>
    </div>
  )
}
