import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import {
  createReleaseReview,
  updateReleaseReviewRating,
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
import { useGetReleaseAction } from './hooks/useGetReleaseAction'
import { useLoginAction } from './hooks/useLoginAction'
import classes from './ReleasePage.module.css'

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
      const review = state.reviews.release[id]
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

  const [login] = useLoginAction()
  useEffect(() => login('admin', 'admin'), [login])

  if (getReleaseAction && isLoading(getReleaseAction.request)) {
    return <div>Loading...</div>
  }

  if (!release) {
    return <div />
  }

  return (
    <div className={classes.container}>
      <div className={clsx(classes.column, classes.left)}>
        {release.coverArt && (
          <img className={classes.coverArt} src={release.coverArt} />
        )}
        {release.tracks.size > 0 && (
          <div className={classes.tracklist}>
            {[...release.tracks].map((id, i) => (
              <Track key={id} id={id} index={i} />
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
              <ReviewWithText key={id} kind='release' id={id} />
            ))}
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div className={classes.section}>
            {[...reviewIds].map((id) => (
              <Review key={id} kind='release' id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
