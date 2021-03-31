import { FunctionComponent } from 'preact'
import { Release } from '../../state'
import { Rating } from './components/Rating'
import { ReleaseDate } from './components/ReleaseDate'
import { Track } from './components/Track'
import classes from './ReleasePage.module.css'

export type Props = {
  release: Release
}

export const ReleasePage: FunctionComponent<Props> = ({ release }) => (
  <div className={classes.container}>
    <div className={classes.column}>
      <img className={classes.coverArt} src={release.coverArt} />
      <div>
        {release.tracks.map((track, i) => (
          <Track key={track.id} track={track} index={i} />
        ))}
      </div>
    </div>
    <div className={classes.column}>
      <div>{release.title}</div>
      <ol className={classes.commaSeparatedList}>
        {release.artists.map((artist) => (
          <li key={artist.id}>
            <a href={`/artist/${artist.id}`}>{artist.name}</a>
          </li>
        ))}
      </ol>
      <ReleaseDate releaseDate={release.releaseDate} />
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
        value={release.userReview.rating ?? 0}
        onChange={(value) => {
          release.userReview.rating = value === 0 ? undefined : value
        }}
      />
    </div>
  </div>
)
