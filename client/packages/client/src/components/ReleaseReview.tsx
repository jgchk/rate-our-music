import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import {
  useGetFullReleaseAction,
  useGetReleaseReviewAction,
} from '../hooks/useAction'
import { build } from '../router/parser'
import { releaseRoute } from '../router/routes'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Artist } from './Artist'
import { Link } from './Link'

export type Props = {
  id: number
}

export const ReleaseReview: FunctionComponent<Props> = ({ id }) => {
  const review = useSelector((state) => state.releaseReviews[id])
  const release = useSelector((state) =>
    review !== undefined ? state.releases[review.release] : undefined
  )

  const [getReleaseReview, getReleaseReviewAction] = useGetReleaseReviewAction()
  useEffect(() => {
    if (review === undefined || review.id !== id) {
      getReleaseReview(id)
    }
  }, [getReleaseReview, id, review])

  const [getRelease, getReleaseAction] = useGetFullReleaseAction()
  useEffect(() => {
    if (
      review !== undefined &&
      (release === undefined || release.id !== review.release)
    ) {
      getRelease(review.release)
    }
  }, [getRelease, release, review])

  const releaseLink = useMemo(
    () =>
      review !== undefined
        ? build(releaseRoute)({ releaseId: review.release })
        : undefined,
    [review]
  )

  if (
    (getReleaseReviewAction && isLoading(getReleaseReviewAction.request)) ||
    (getReleaseAction && isLoading(getReleaseAction.request))
  ) {
    return <div>Loading...</div>
  }
  if (!review) return <div>No review found with id: {id}</div>
  if (!release) return <div>No release found with id: {review.release}</div>

  return (
    <div>
      {[...release.artists].map((id) => (
        <Artist key={id} id={id} />
      ))}
      <Link href={releaseLink}>{release.title}</Link>
      <div>{review.rating}</div>
    </div>
  )
}
