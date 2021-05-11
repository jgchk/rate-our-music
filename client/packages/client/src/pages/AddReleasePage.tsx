import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import {
  useAddReleaseMutation,
  useGetAllReleaseTypesQuery,
  useGetArtistQuery,
  useSearchArtistsQuery,
} from '../generated/graphql'
import { useDebounce } from '../hooks/useDebounce'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { build } from '../router/parser'
import { releaseRoute } from '../router/routes'
import { useRouterContext } from '../router/useRouterContext'
import { clsx } from '../utils/clsx'

const ID = {
  type: 'type',
  title: 'title',
} as const

export const AddReleasePage: FunctionComponent = () => {
  const [{ data: releaseTypesData }] = useGetAllReleaseTypesQuery()
  const releaseTypes = useMemo(() => releaseTypesData?.releaseType.getAll, [
    releaseTypesData?.releaseType.getAll,
  ])
  const [releaseType, setReleaseType] = useState(releaseTypes?.[0]?.id)

  useEffect(() => {
    if (
      releaseType === undefined &&
      releaseTypes !== undefined &&
      releaseTypes.length > 0
    ) {
      setReleaseType(releaseTypes[0]?.id)
    }
  }, [releaseType, releaseTypes])

  const [title, setTitle] = useState('')
  const [artistIds, setArtistIds] = useState<number[]>([])

  const [{ data: addReleaseData }, addRelease] = useAddReleaseMutation()

  const { push } = useRouterContext()
  useEffect(() => {
    if (addReleaseData) {
      const id = addReleaseData.releases.add.id
      const link = build(releaseRoute)({ releaseId: id })
      push(link)
    }
  }, [addReleaseData, push])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (releaseType !== undefined) {
          void addRelease({
            release: { title, releaseTypeId: releaseType, artistIds },
          })
        }
      }}
    >
      <div>
        <label htmlFor={ID.type}>Release Type</label>
        <select
          id={ID.type}
          value={releaseType}
          onChange={(e) =>
            setReleaseType(Number.parseInt(e.currentTarget.value))
          }
        >
          {releaseTypes?.map((releaseType) => (
            <option key={releaseType.id} value={releaseType.id}>
              {releaseType.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Artist</label>
        <Artists
          selectedIds={artistIds}
          onChange={(values) => setArtistIds(values)}
        />
      </div>
      <div>
        <label htmlFor={ID.title}>Title</label>
        <input
          id={ID.title}
          type='text'
          value={title}
          onInput={(e) => setTitle(e.currentTarget.value)}
        />
      </div>
      <button type='submit'>Submit</button>
    </form>
  )
}

const Artists: FunctionComponent<{
  selectedIds: number[]
  onChange: (selectedIds: number[]) => void
}> = ({ selectedIds, onChange }) => {
  const [inputValue, setInputValue] = useState('')

  return (
    <div>
      <div className='flex'>
        {selectedIds.map((id) => (
          <Artist key={id} id={id} />
        ))}
        <ArtistInput
          value={inputValue}
          onInput={(value) => setInputValue(value)}
          onSelect={(id) => {
            if (!selectedIds.includes(id)) {
              onChange([...selectedIds, id])
              setInputValue('')
            }
          }}
        />
      </div>
    </div>
  )
}

const Artist: FunctionComponent<{ id: number }> = ({ id }) => {
  const [{ data, fetching, error }] = useGetArtistQuery({ variables: { id } })
  const artist = useMemo(() => data?.artist.get, [data?.artist.get])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!artist) return <div>No artist found</div>

  return <div>{artist.name}</div>
}

const ArtistInput: FunctionComponent<{
  value: string
  onInput: (value: string) => void
  onSelect: (id: number) => void
}> = ({ value, onInput, onSelect }) => {
  const [isFocused, setFocused] = useState(false)
  const [selectedId, setSelectedId] = useState<undefined | number>(undefined)

  const debouncedInput = useDebounce(value, 500)

  const [{ data }] = useSearchArtistsQuery({
    variables: { query: debouncedInput },
  })
  const suggestions = useMemo(
    () => data?.artist.search.map(({ id }) => id) ?? [],
    [data?.artist.search]
  )

  useEffect(() => {
    if (suggestions.length === 0) {
      setSelectedId(undefined)
    } else if (selectedId === undefined) {
      const firstId = suggestions[0]
      if (firstId !== undefined) {
        setSelectedId(firstId)
      }
    }
  }, [selectedId, suggestions])

  const ref = useRef<HTMLDivElement>()
  useOnClickOutside(ref, () => setFocused(false))

  const inputRef = useRef<HTMLInputElement>()

  const handleEnter = () => {
    if (selectedId !== undefined) {
      onSelect(selectedId)
    }
  }

  return (
    <div className='relative' ref={ref}>
      <input
        ref={inputRef}
        value={value}
        onInput={(e) => onInput(e.currentTarget.value)}
        onKeyPress={(e) => {
          if (e.code === 'Enter') {
            handleEnter()
          }
        }}
        onFocus={() => setFocused(true)}
        className='border'
      />
      {isFocused && (
        <div className='absolute bg-white border border-t-0'>
          {suggestions.map((id) => (
            <DropdownArtist
              key={id}
              id={id}
              onClick={() => onSelect(id)}
              selected={id === selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const DropdownArtist: FunctionComponent<{
  id: number
  onClick: () => void
  selected: boolean
}> = ({ id, onClick, selected }) => {
  const [{ data, fetching, error }] = useGetArtistQuery({ variables: { id } })
  const artist = useMemo(() => data?.artist.get, [data?.artist.get])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!artist) return <div>No artist found</div>

  return (
    <button
      type='button'
      className={clsx('p-1', selected && 'bg-gray-500')}
      onClick={onClick}
    >
      {artist.name}
    </button>
  )
}
