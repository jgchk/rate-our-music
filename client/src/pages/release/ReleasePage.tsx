import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { getRelease } from '../../state/release'
import { useDispatch, useSelector } from '../../state/store'
import { isFailure, isInitial, isLoading } from '../../utils/remote-data'
import { Rating } from './components/Rating'
import { ReleaseDate } from './components/ReleaseDate'
import { Track } from './components/Track'
import classes from './ReleasePage.module.css'

export const ReleasePage: FunctionComponent = () => {
  const state = useSelector((state) => state.release)

  const dispatch = useDispatch()
  useEffect(() => dispatch(getRelease(0)), [dispatch])

  if (isInitial(state)) {
    return <div />
  }

  if (isLoading(state)) {
    return <div>Loading...</div>
  }

  if (isFailure(state)) {
    return <div>{state.error}</div>
  }

  const release = state.data
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
          <div>whoa</div>
        </div>
        <Rating
          value={release.userReview?.rating ?? 0}
          onChange={(value) => {
            console.log(value)
            // release.userReview.rating = value === 0 ? undefined : value
            // TODO
          }}
        />
      </div>
    </div>
  )
}
