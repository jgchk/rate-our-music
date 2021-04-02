import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { getRelease, updateReview } from '../../state/slices/release-page'
import { useDispatch, useSelector } from '../../state/store'
import { isFailure, isLoading } from '../../utils/remote-data'
import { Rating } from './components/Rating'
import { ReleaseDate } from './components/ReleaseDate'
import { Track } from './components/Track'
import classes from './ReleasePage.module.css'

export const ReleasePage: FunctionComponent = () => {
  const release = useSelector((state) => state.releasePage.release)
  const getReleaseRequest = useSelector(
    (state) => state.releasePage.requests.getRelease
  )
  const updateReviewRequest = useSelector(
    (state) => state.releasePage.requests.updateReview
  )

  const dispatch = useDispatch()
  useEffect(() => dispatch(getRelease(0)), [dispatch])

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
        <div>
          {release.tracks.map((track, i) => (
            <Track key={track.id} track={track} index={i} />
          ))}
        </div>
      </div>
      <div className={clsx(classes.column, classes.right)}>
        <div>{release.title}</div>
        <ol className={classes.commaSeparatedList}>
          {release.artists.map((artist) => (
            <li key={artist.id}>
              <a href={`/artist/${artist.id}`}>{artist.name}</a>
            </li>
          ))}
        </ol>
        {release.releaseDate && (
          <ReleaseDate releaseDate={release.releaseDate} />
        )}
        <ol className={classes.commaSeparatedList}>
          {release.genres.map((genre) => (
            <li key={genre.id}>
              <a href={`/genre/${genre.id}`}>{genre.name}</a>
            </li>
          ))}
        </ol>
        <div>
          <div>{release.siteRating}</div>
          <div>{release.friendRating}</div>
          <div>{release.similarUserRating}</div>
        </div>
        <div>
          <Rating
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
      </div>
    </div>
  )
}
