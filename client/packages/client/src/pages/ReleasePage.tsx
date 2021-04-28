import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { Artist } from '../components/Artist'
import { RatingStarsInput } from '../components/RatingStarsInput'
import { ReleaseDate } from '../components/ReleaseDate'
import { ReleaseGenre } from '../components/ReleaseGenre'
import { ReleaseReview } from '../components/Review'
import { ReleaseReviewWithText } from '../components/ReviewWithText'
import { Track } from '../components/Track'
import { useGetReleaseAction } from '../hooks/useAction'
import {
  createReleaseReview,
  updateReleaseReviewRating,
} from '../state/slices/release-reviews'
import { useDispatch, useSelector } from '../state/store'
import { findMap } from '../utils/array'
import { isLoading } from '../utils/remote-data'

export type Props = {
  releaseId: number
}

export const ReleasePage: FunctionComponent<Props> = ({ releaseId }) => {
  const release = useSelector((state) => state.releases[releaseId])

  const reviewIds = useSelector((state) => state.releases[releaseId]?.reviews)

  const user = useSelector((state) => {
    const id = state.auth.auth?.user
    if (id !== undefined) {
      return state.users[id]
    }
  })
  const userReview = useSelector((state) => {
    if (!user || !reviewIds) return
    return findMap([...reviewIds], (id) => {
      const review = state.releaseReviews[id]
      if (review && review.user === user.id) {
        return review
      }
    })
  })

  const dispatch = useDispatch()

  const [getRelease, getReleaseAction] = useGetReleaseAction()
  useEffect(() => {
    if (release === undefined || release.id !== releaseId) {
      getRelease(releaseId)
    }
  }, [getRelease, release, releaseId])

  if (getReleaseAction && isLoading(getReleaseAction.request)) {
    return <div>Loading...</div>
  }

  if (!release) {
    return <div />
  }

  return (
    <div className='flex gap-4 p-4'>
      <div className='flex flex-col gap-3 flex-1'>
        {release.coverArt && <img className='w-full' src={release.coverArt} />}
        {release.tracks.size > 0 && (
          <div className='flex flex-col'>
            {[...release.tracks].map((id, i) => (
              <Track key={id} id={id} index={i} />
            ))}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-3 flex-2'>
        <div>
          <div className='font-3xl'>{release.title}</div>
          <ol className='comma-list'>
            {[...release.artists].map((id) => (
              <li key={id}>
                <Artist id={id} />
              </li>
            ))}
          </ol>
          {release.releaseDate && (
            <ReleaseDate releaseDate={release.releaseDate} />
          )}
        </div>

        <div>
          <ol className='comma-list'>
            {Object.keys(release.genres)
              .map(Number)
              .map((id) => (
                <li key={id}>
                  <ReleaseGenre id={id} releaseId={releaseId} />
                </li>
              ))}
          </ol>
        </div>

        <div>
          {release.siteRating !== undefined && (
            <div>{(release.siteRating / 2).toFixed(1)}</div>
          )}
        </div>

        {user && (
          <div>
            <RatingStarsInput
              value={userReview?.rating ?? 0}
              onChange={(rating) => {
                dispatch(
                  userReview
                    ? updateReleaseReviewRating(userReview.id, rating)
                    : createReleaseReview(releaseId, user.id, { rating })
                )
              }}
            />
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div>
            {[...reviewIds].map((id) => (
              <ReleaseReviewWithText key={id} id={id} />
            ))}
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div>
            {[...reviewIds].map((id) => (
              <ReleaseReview key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
