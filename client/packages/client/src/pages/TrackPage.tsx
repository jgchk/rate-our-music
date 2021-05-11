import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { Artist } from '../components/Artist'
import { TrackGenres } from '../components/Genres'
import { ReleaseDate } from '../components/ReleaseDate'
import { TrackReview } from '../components/Review'
import { TrackReviewWithText } from '../components/ReviewWithText'
import { Track } from '../components/Track'
import { ReleaseViewLink } from '../components/TracklistReleaseViewLink'
import { useGetTrackPageQuery } from '../generated/graphql'
import { isSome } from '../utils/types'

export type Props = {
  trackId: number
}

export const TrackPage: FunctionComponent<Props> = ({ trackId }) => {
  const [{ data, fetching, error }] = useGetTrackPageQuery({
    variables: { id: trackId },
  })
  const track = useMemo(() => data?.track.get, [data?.track.get])
  const release = useMemo(() => data?.track.get.release, [
    data?.track.get.release,
  ])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!track || !release) return <div>No track found</div>

  return (
    <div className='flex gap-4 p-4'>
      <div className='flex flex-col gap-3 flex-1'>
        {release.coverArt && <img className='w-full' src={release.coverArt} />}
        {release.tracks.length > 0 && (
          <div className='flex flex-col'>
            <ReleaseViewLink href={`/release/${release.id}`} />
            {release.tracks.map(({ id }, i) => (
              <Track key={id} id={id} index={i} />
            ))}
          </div>
        )}
      </div>

      <div className='flex flex-col gap-3 flex-2'>
        <div>
          <div className='font-3xl'>{track.title}</div>
          <ol className='comma-list'>
            {track.artists.map(({ id }) => (
              <li key={id}>
                <Artist id={id} />
              </li>
            ))}
          </ol>
          {release.releaseDate && (
            <ReleaseDate releaseDate={release.releaseDate} />
          )}
        </div>

        <TrackGenres trackGenres={track.genres} />

        <div>
          {isSome(track.siteRating) && (
            <div>{(track.siteRating / 2).toFixed(1)}</div>
          )}
        </div>

        {/* {user && (
          <div>
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
        )} */}

        {track.reviews && track.reviews.length > 0 && (
          <div>
            {track.reviews.map(({ id }) => (
              <TrackReviewWithText key={id} id={id} />
            ))}
          </div>
        )}

        {track.reviews && track.reviews.length > 0 && (
          <div>
            {track.reviews.map(({ id }) => (
              <TrackReview key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
