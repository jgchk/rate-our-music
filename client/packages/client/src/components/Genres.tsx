import { Fragment, FunctionComponent, h } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import {
  useCreateReleaseGenreVoteAction,
  useGetAllGenresAction,
} from '../hooks/useAction'
import { ReleaseGenre as ReleaseGenreModel } from '../state/slices/releases'
import { useSelector } from '../state/store'
import { ReleaseGenre } from './ReleaseGenre'
import { TrackGenre } from './TrackGenre'

type GenreInputProps = {
  onSelect: (genreId: number) => void
}

const GenreInput: FunctionComponent<GenreInputProps> = ({ onSelect }) => {
  const [getAllGenres, getAllGenresAction] = useGetAllGenresAction()
  const genres = useSelector((state) => Object.values(state.genres.genres))

  const genresLastFetched = useSelector((state) => state.genres.lastFetchedAll)
  useEffect(() => {
    if (genresLastFetched === undefined) {
      getAllGenres()
    }
  }, [genresLastFetched, getAllGenres])

  const [input, setInput] = useState('')
  const [selectedId, setSelectedId] = useState<number | undefined>(
    // eslint-disable-next-line unicorn/no-useless-undefined
    undefined
  )

  const suggestions = useMemo(
    () => genres.filter((genre) => genre.name.toLowerCase().includes(input)),
    [genres, input]
  )
  useEffect(() => {
    const topSuggestion = suggestions[0]
    if (topSuggestion !== undefined) {
      setSelectedId(topSuggestion.id)
    }
  }, [suggestions])

  return (
    <div>
      <input
        type='text'
        value={input}
        onInput={(e) => setInput(e.currentTarget.value)}
        onKeyPress={(e) => {
          if (e.code === 'Enter' && selectedId !== undefined) {
            onSelect(selectedId)
          }
        }}
      />
      <ol className='comma-list'>
        {suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion.name}</li>
        ))}
      </ol>
    </div>
  )
}

export type ReleaseGenresProps = {
  releaseGenres: Set<ReleaseGenreModel>
  releaseId: number
}

export const ReleaseGenres: FunctionComponent<ReleaseGenresProps> = ({
  releaseGenres,
  releaseId,
}) => {
  const [isVoting, setVoting] = useState(false)

  const [
    createReleaseGenreVote,
    createReleaseGenreVoteAction,
  ] = useCreateReleaseGenreVoteAction()

  const token = useSelector((state) => state.auth.auth?.token)

  return (
    <div>
      <div>Genres</div>
      <div className='flex'>
        {releaseGenres.size === 0 ? (
          <div className='flex-1'>None yet</div>
        ) : (
          <ol className='comma-list flex-1'>
            {[...releaseGenres].map((releaseGenre) => (
              <li key={releaseGenre.genreId}>
                <ReleaseGenre releaseGenre={releaseGenre} />
              </li>
            ))}
          </ol>
        )}
        <button onClick={() => setVoting(!isVoting)}>Vote</button>
      </div>
      {isVoting && (
        <>
          {token && (
            <GenreInput
              onSelect={(genreId) =>
                createReleaseGenreVote(token, releaseId, genreId, 1)
              }
            />
          )}
        </>
      )}
    </div>
  )
}

export type TrackGenresProps = {
  trackGenres: Set<ReleaseGenreModel>
}

export const TrackGenres: FunctionComponent<TrackGenresProps> = ({
  trackGenres,
}) => {
  return (
    <div>
      <ol className='comma-list'>
        {[...trackGenres].map((trackGenre) => (
          <li key={trackGenre.genreId}>
            <TrackGenre trackGenre={trackGenre} />
          </li>
        ))}
      </ol>
    </div>
  )
}
