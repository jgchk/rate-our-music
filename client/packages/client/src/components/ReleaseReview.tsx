import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useGetReleaseReviewQuery } from '../generated/graphql'
import { build } from '../router/parser'
import { releaseRoute } from '../router/routes'
import { Artist } from './Artist'
import { Link } from './Link'
import { RatingStars } from './RatingStars'

export type Props = {
  id: number
}

export const ReleaseReview: FunctionComponent<Props> = ({ id }) => {
  const [{ data, fetching, error }] = useGetReleaseReviewQuery({
    variables: { id },
  })
  const review = useMemo(() => data?.releaseReview.get, [
    data?.releaseReview.get,
  ])
  const link = useMemo(
    () =>
      review !== undefined
        ? build(releaseRoute)({ releaseId: review.release.id })
        : undefined,
    [review]
  )

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!review) return <div>No review found</div>

  return (
    <div className='flex align-center'>
      {review.rating && <RatingStars value={review.rating} />}
      {review.release.artists.map(({ id }) => (
        <Artist key={id} id={id} />
      ))}
      <Link href={link}>{review.release.title}</Link>
    </div>
  )
}
