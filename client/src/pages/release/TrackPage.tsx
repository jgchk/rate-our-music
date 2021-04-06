import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import {
  createTrackReview,
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
import { ReleaseViewLink } from './components/TracklistReleaseViewLink'
import { useGetReleaseAction } from './hooks/useGetReleaseAction'
import { useGetTrackAction } from './hooks/useGetTrackAction'
import { useLoginAction } from './hooks/useLoginAction'
import classes from './ReleasePage.module.css'

export type Props = {
  trackId: number
}

export const TrackPage: FunctionComponent<Props> = ({ trackId }) => {
  const track = useSelector((state) => state.tracks[trackId])
  const release = useSelector((state) => {
    if (track?.release === undefined) return
    return state.releases[track.release]
  })

  const reviewIds = useSelector((state) => state.tracks[trackId]?.reviews)

  const user = useSelector((state) => {
    const id = state.auth.auth?.user
    if (id !== undefined) {
      return state.users[id]
    }
  })
  const userReview = useSelector((state) => {
    if (!user || !reviewIds) return
    return findMap([...reviewIds], (id) => {
      const review = state.reviews.track[id]
      if (review && review.user === user.id) {
        return review
      }
    })
  })

  const dispatch = useDispatch()

  const [getTrack, getTrackAction] = useGetTrackAction()
  useEffect(() => {
    if (track === undefined || track.id !== trackId) {
      getTrack(trackId)
    }
  }, [getTrack, track, trackId])

  const [getRelease, getReleaseAction] = useGetReleaseAction()
  useEffect(() => {
    if (
      track !== undefined &&
      (release === undefined || release.id !== track.release)
    ) {
      getRelease(track.release)
    }
  }, [getRelease, release, track])

  const [login] = useLoginAction()
  useEffect(() => login('admin', 'admin'), [login])

  if (
    (getTrackAction && isLoading(getTrackAction.request)) ||
    (getReleaseAction && isLoading(getReleaseAction.request))
  ) {
    return <div>Loading...</div>
  }

  if (!track || !release) {
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
            <ReleaseViewLink href={`/release/${release.id}`} />
            {[...release.tracks].map((id, i) => (
              <Track key={id} id={id} index={i} />
            ))}
          </div>
        )}
      </div>

      <div className={clsx(classes.column, classes.right)}>
        <div className={classes.section}>
          <div className={classes.title}>{track.title}</div>
          <ol className={clsx(classes.artists, classes.commaSeparatedList)}>
            {[...track.artists].map((id) => (
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
            {[...track.genres].map((id) => (
              <li key={id}>
                <Genre id={id} />
              </li>
            ))}
          </ol>
        </div>

        <div className={classes.section}>
          {track.siteRating !== undefined && (
            <div>{(track.siteRating / 2).toFixed(1)}</div>
          )}
          {track.friendRating !== undefined && (
            <div>{(track.friendRating / 2).toFixed(1)}</div>
          )}
          {track.similarUserRating !== undefined && (
            <div>{(track.similarUserRating / 2).toFixed(1)}</div>
          )}
        </div>

        {user && (
          <div className={classes.section}>
            <RatingStarsInput
              value={userReview?.rating ?? 0}
              onChange={(rating) => {
                dispatch(
                  userReview
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
              <ReviewWithText key={id} kind='track' id={id} />
            ))}
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div className={classes.section}>
            {[...reviewIds].map((id) => (
              <Review key={id} kind='track' id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
