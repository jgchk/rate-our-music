import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { getRelease, updateReview } from '../../state/slices/release-page'
import { useDispatch, useSelector } from '../../state/store'
import { isFailure, isLoading } from '../../utils/remote-data'
import { Link } from '../common/components/Link'
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
  const release = useSelector((state) => state.releasePage.release)
  const getReleaseRequest = useSelector(
    (state) => state.releasePage.requests.getRelease
  )
  const updateReviewRequest = useSelector(
    (state) => state.releasePage.requests.updateReview
  )

  const reviewIds = useMemo(
    () =>
      trackId === undefined
        ? release?.reviews.release
        : release?.reviews.tracks[trackId],
    [release?.reviews.release, release?.reviews.tracks, trackId]
  )

  const dispatch = useDispatch()
  useEffect(() => dispatch(getRelease(releaseId)), [dispatch, releaseId])

  if (isLoading(getReleaseRequest)) {
    return <div>Loading...</div>
  }

  if (!release) {
    return <div />
  }

  return (
    <div className={classes.container}>
      <div className={clsx(classes.column, classes.left)}>
        <img className={classes.coverArt} src={release.coverArt} />
        <div className={classes.tracklist}>
          {release.tracks.map((track, i) => (
            <Track
              key={track.id}
              track={track}
              index={i}
              onClick={() => console.log(i)}
            />
          ))}
        </div>
      </div>

      <div className={clsx(classes.column, classes.right)}>
        <div className={classes.section}>
          <div className={classes.title}>{release.title}</div>
          <ol className={clsx(classes.artists, classes.commaSeparatedList)}>
            {release.artists.map((artist) => (
              <li key={artist.id}>
                <Link className={classes.artist} href={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </li>
            ))}
          </ol>
          {release.releaseDate && (
            <ReleaseDate releaseDate={release.releaseDate} />
          )}
        </div>

        <div className={classes.section}>
          <ol className={classes.commaSeparatedList}>
            {release.genres.map((genre) => (
              <li key={genre.id}>
                <Link href={`/genre/${genre.id}`}>{genre.name}</Link>
              </li>
            ))}
          </ol>
        </div>

        <div className={classes.section}>
          <div>{release.siteRating}</div>
          <div>{release.friendRating}</div>
          <div>{release.similarUserRating}</div>
        </div>

        <div className={classes.section}>
          <RatingStarsInput
            value={release.userReview.rating ?? 0}
            onChange={(rating) =>
              dispatch(updateReview({ rating }, release.userReview))
            }
          />
          {isFailure(updateReviewRequest) && (
            <div
              className={classes.error}
            >{`I couldn't update your review :(`}</div>
          )}
        </div>

        <div>
          {reviewIds?.allIdsWithText.map((id) => (
            <ReviewWithText key={id} id={id} />
          ))}
        </div>

        <div className={classes.section}>
          {reviewIds?.allIds.map((id) => (
            <Review key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  )
}
