import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import {
  useGetReleaseAction,
  useGetTrackAction,
} from '../../common/hooks/useAction'
import { useDispatch, useSelector } from '../../common/state/store'
import { findMap } from '../../common/utils/array'
import { clsx } from '../../common/utils/clsx'
import { isLoading } from '../../common/utils/remote-data'
import { Artist } from '../components/Artist'
import { RatingStarsInput } from '../components/RatingStarsInput'
import { ReleaseDate } from '../components/ReleaseDate'
import { TrackReview } from '../components/Review'
import { TrackReviewWithText } from '../components/ReviewWithText'
import { Track } from '../components/Track'
import { TrackGenre } from '../components/TrackGenre'
import { ReleaseViewLink } from '../components/TracklistReleaseViewLink'
import {
  createTrackReview,
  updateTrackReviewRating,
} from '../state/track-reviews'
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
      const review = state.trackReviews[id]
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
            {Object.keys(track.genres)
              .map(Number)
              .map((id) => (
                <li key={id}>
                  <TrackGenre id={id} trackId={trackId} />
                </li>
              ))}
          </ol>
        </div>

        <div className={classes.section}>
          {track.siteRating !== undefined && (
            <div>{(track.siteRating / 2).toFixed(1)}</div>
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
              <TrackReviewWithText key={id} id={id} />
            ))}
          </div>
        )}

        {reviewIds && reviewIds.size > 0 && (
          <div className={classes.section}>
            {[...reviewIds].map((id) => (
              <TrackReview key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}