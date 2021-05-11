import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { Artist } from '../components/Artist'
import { ReleaseGenres } from '../components/Genres'
import { ReleaseDate } from '../components/ReleaseDate'
import { ReleaseReview } from '../components/Review'
import { ReleaseReviewWithText } from '../components/ReviewWithText'
import { Track } from '../components/Track'
import { useGetFullReleaseQuery } from '../generated/graphql'
import { isSome } from '../utils/types'

export type Props = {
  releaseId: number
}

export const ReleasePage: FunctionComponent<Props> = ({ releaseId }) => {
  const [{ data, fetching, error }] = useGetFullReleaseQuery({
    variables: { id: releaseId },
  })
  const release = useMemo(() => data?.release.get, [data?.release.get])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!release) return <div>No release found</div>

  return (
    <div className='flex gap-4 p-4'>
      <div className='flex flex-col gap-3 flex-1'>
        {release.coverArt && <img className='w-full' src={release.coverArt} />}
        {release.tracks.length > 0 && (
          <div className='flex flex-col'>
            {[...release.tracks].map(({ id }, i) => (
              <Track key={id} id={id} index={i} />
            ))}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-3 flex-2'>
        <div>
          <div className='font-3xl'>{release.title}</div>
          <ol className='comma-list'>
            {[...release.artists].map(({ id }) => (
              <li key={id}>
                <Artist id={id} />
              </li>
            ))}
          </ol>
          {release.releaseDate && (
            <ReleaseDate releaseDate={release.releaseDate} />
          )}
        </div>

        <ReleaseGenres releaseGenres={release.genres} releaseId={releaseId} />

        <div>
          {isSome(release.siteRating) && (
            <div>{(release.siteRating / 2).toFixed(1)}</div>
          )}
        </div>

        {/* {user && (
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
        )} */}

        {release.reviews && release.reviews.length > 0 && (
          <div>
            {release.reviews.map(({ id }) => (
              <ReleaseReviewWithText key={id} id={id} />
            ))}
          </div>
        )}

        {release.reviews && release.reviews.length > 0 && (
          <div>
            {release.reviews.map(({ id }) => (
              <ReleaseReview key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
