import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { login } from '../../state/slices/auth'
import { getRelease } from '../../state/slices/releases'
import {
  createReleaseReview,
  createTrackReview,
  updateReleaseReviewRating,
  updateTrackReviewRating,
} from '../../state/slices/reviews'
import { useDispatch, useSelector } from '../../state/store'
import { findMap } from '../../utils/array'
import { isLoading } from '../../utils/remote-data'
import { Artist } from './components/Artist'
import { Genre } from './components/Genre'
import { RatingStarsInput } from './components/RatingStarsInput'
import { ReleaseDate } from './components/ReleaseDate'
import { Review } from './components/Review'
import { ReviewWithText } from './components/ReviewWithText'
import { Track } from './components/Track'
import classes from './ReleasePage.module.css'

export type Props = {
  releaseId: number
  trackId?: number
}

export const ReleasePage: FunctionComponent<Props> = ({
  releaseId,
  trackId,
}) => {
  const release = useSelector((state) => state.releases[releaseId])

  const reviewIds = useSelector((state) =>
    trackId === undefined
      ? state.releases[releaseId]?.reviews
      : state.tracks[trackId]?.reviews
  )

  const user = useSelector((state) => {
    const id = state.auth.auth?.user
    if (id !== undefined) {
      return state.users[id]
    }
  })
  const userReview = useSelector((state) => {
    if (!user || !reviewIds) return
    const reviews =
      trackId === undefined ? state.reviews.release : state.reviews.track
    return findMap([...reviewIds], (id) => {
      const review = reviews[id]
      if (review && review.user === user.id) {
        return review
      }
    })
  })

  const dispatch = useDispatch()

  const [getReleaseActionId, setGetReleaseActionId] = useState<
    number | undefined
  >(undefined)
  const getReleaseAction = useSelector((state) => {
    if (getReleaseActionId === undefined) return undefined
    const action = state.actions[getReleaseActionId]
    if (action?._type !== 'release/get') return undefined
    return action
  })
  useEffect(() => {
    if (release === undefined || release.id !== releaseId) {
      setGetReleaseActionId(dispatch(getRelease(releaseId)))
    }
  }, [dispatch, release, releaseId])

  useEffect(() => void dispatch(login('admin', 'admin')), [dispatch])

  if (getReleaseAction && isLoading(getReleaseAction.request)) {
    return <div>Loading...</div>
  }

  if (!release) {
    return <div />
  }

  return (
    <div className={classes.container}>
      <div className={clsx(classes.column, classes.left)}>
        <img className={classes.coverArt} src={release.coverArt} />
        {release.tracks.size > 0 && (
          <div className={classes.tracklist}>
            {[...release.tracks].map((id, i) => (
              <Track
                key={id}
                id={id}
                index={i}
                href={`/release/${release.id}/track/${id}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={clsx(classes.column, classes.right)}>
        <div className={classes.section}>
          <div className={classes.title}>{release.title}</div>
          <ol className={clsx(classes.artists, classes.commaSeparatedList)}>
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

        <div className={classes.section}>
          <ol className={classes.commaSeparatedList}>
            {[...release.genres].map((id) => (
              <li key={id}>
                <Genre id={id} />
              </li>
            ))}
          </ol>
        </div>

        <div className={classes.section}>
          {release.siteRating !== undefined && (
            <div>{(release.siteRating / 2).toFixed(1)}</div>
          )}
          {release.friendRating !== undefined && (
            <div>{(release.friendRating / 2).toFixed(1)}</div>
          )}
          {release.similarUserRating !== undefined && (
            <div>{(release.similarUserRating / 2).toFixed(1)}</div>
          )}
        </div>

        {user && (
          <div className={classes.section}>
            <RatingStarsInput
              value={userReview?.rating ?? 0}
              onChange={(rating) => {
                dispatch(
                  trackId === undefined
                    ? userReview
                      ? updateReleaseReviewRating(userReview.id, rating)
                      : createReleaseReview(releaseId, user.id, { rating })
                    : userReview
                    ? updateTrackReviewRating(userReview.id, rating)
                    : createTrackReview(trackId, user.id, { rating })
                )
              }}
            />
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div>
            {[...reviewIds].map((id) => (
              <ReviewWithText
                key={id}
                kind={trackId === undefined ? 'release' : 'track'}
                id={id}
              />
            ))}
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div className={classes.section}>
            {[...reviewIds].map((id) => (
              <Review
                key={id}
                kind={trackId === undefined ? 'release' : 'track'}
                id={id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
