import { Fragment, FunctionComponent, h } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import {
  ReleaseGenreDataFragment,
  TrackGenreDataFragment,
  useCreateReleaseGenreVoteMutation,
  useGetAllGenresQuery,
  useWhoAmIQuery,
} from '../generated/graphql'
import { ReleaseGenre } from './ReleaseGenre'
import { TrackGenre } from './TrackGenre'

type GenreInputProps = {
  onSelect: (genreId: number) => void
}

const GenreInput: FunctionComponent<GenreInputProps> = ({ onSelect }) => {
  const [{ data }] = useGetAllGenresQuery()
  const genres = useMemo(() => data?.genre.getAll, [data?.genre.getAll])

  const [input, setInput] = useState('')
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)

  const suggestions = useMemo(
    () => genres?.filter((genre) => genre.name.toLowerCase().includes(input)),
    [genres, input]
  )
  useEffect(() => {
    const topSuggestion = suggestions?.[0]
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
        {suggestions?.map((suggestion) => (
          <li key={suggestion}>{suggestion.name}</li>
        ))}
      </ol>
    </div>
  )
}

export type ReleaseGenresProps = {
  releaseGenres: ReleaseGenreDataFragment[]
  releaseId: number
}

export const ReleaseGenres: FunctionComponent<ReleaseGenresProps> = ({
  releaseGenres,
  releaseId,
}) => {
  const [isVoting, setVoting] = useState(false)

  const [, createReleaseGenreVote] = useCreateReleaseGenreVoteMutation()

  const [{ data: userData }] = useWhoAmIQuery()

  return (
    <div>
      <div>Genres</div>
      <div className='flex'>
        {releaseGenres.length === 0 ? (
          <div className='flex-1'>None yet</div>
        ) : (
          <ol className='comma-list flex-1'>
            {releaseGenres.map((releaseGenre) => (
              <li key={releaseGenre.genre.id}>
                <ReleaseGenre id={releaseGenre.genre.id} />
              </li>
            ))}
          </ol>
        )}
        <button onClick={() => setVoting(!isVoting)}>Vote</button>
      </div>
      {isVoting && (
        <>
          {userData && (
            <GenreInput
              onSelect={(genreId) =>
                createReleaseGenreVote({ releaseId, genreId, value: 1 })
              }
            />
          )}
        </>
      )}
    </div>
  )
}

export type TrackGenresProps = {
  trackGenres: TrackGenreDataFragment[]
}

export const TrackGenres: FunctionComponent<TrackGenresProps> = ({
  trackGenres,
}) => {
  return (
    <div>
      <ol className='comma-list'>
        {trackGenres.map((trackGenre) => (
          <li key={trackGenre.genre.id}>
            <TrackGenre id={trackGenre.genre.id} />
          </li>
        ))}
      </ol>
    </div>
  )
}
