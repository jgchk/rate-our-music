import { FunctionComponent, h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import {
  useAddReleaseAction,
  useGetAllReleaseTypesAction,
  useGetArtistAction,
  useSearchArtistsAction,
} from '../hooks/useAction'
import { useDebounce } from '../hooks/useDebounce'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { build } from '../router/parser'
import { releaseRoute } from '../router/routes'
import { useRouterContext } from '../router/useRouterContext'
import { useSelector } from '../state/store'
import { clsx } from '../utils/clsx'
import { isLoading, isSuccess } from '../utils/remote-data'

const ID = {
  type: 'type',
  title: 'title',
} as const

export const AddReleasePage: FunctionComponent = () => {
  const releaseTypes = useSelector((state) =>
    Object.values(state.releaseTypes.releaseTypes)
  )
  const [releaseType, setReleaseType] = useState(releaseTypes[0]?.id)

  const [getAllReleaseTypes] = useGetAllReleaseTypesAction()
  const releaseTypesLastFetched = useSelector(
    (state) => state.releaseTypes.lastFetchedAll
  )
  useEffect(() => {
    if (releaseTypesLastFetched === undefined) {
      getAllReleaseTypes()
    }
  }, [getAllReleaseTypes, releaseTypesLastFetched])
  useEffect(() => {
    if (releaseType === undefined && releaseTypes.length > 0) {
      setReleaseType(releaseTypes[0]?.id)
    }
  }, [releaseType, releaseTypes])

  const [title, setTitle] = useState('')
  const [artistIds, setArtistIds] = useState<number[]>([])

  const [addRelease, addReleaseAction] = useAddReleaseAction()
  const { push } = useRouterContext()
  useEffect(() => {
    if (addReleaseAction && isSuccess(addReleaseAction.request)) {
      const id = addReleaseAction.request.data.releases.add.id
      const link = build(releaseRoute)({ releaseId: id })
      push(link)
    }
  }, [addReleaseAction, push])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (releaseType !== undefined) {
          addRelease({ title, releaseTypeId: releaseType, artistIds })
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
          {releaseTypes.map((releaseType) => (
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
  const artist = useSelector((state) => state.artists[id])

  const [getArtist, getArtistAction] = useGetArtistAction()
  useEffect(() => {
    if (artist === undefined || artist.id !== id) {
      getArtist(id)
    }
  }, [artist, getArtist, id])

  if (getArtistAction && isLoading(getArtistAction.request)) {
    return <div>Loading...</div>
  }
  if (!artist) return <div>No artist found with id: {id}</div>

  return <div>{artist.name}</div>
}

const ArtistInput: FunctionComponent<{
  value: string
  onInput: (value: string) => void
  onSelect: (id: number) => void
}> = ({ value, onInput, onSelect }) => {
  const [isFocused, setFocused] = useState(false)
  const [selectedId, setSelectedId] = useState<undefined | number>(
    // eslint-disable-next-line unicorn/no-useless-undefined
    undefined
  )

  const debouncedInput = useDebounce(value, 500)
  const [suggestions, setSuggestions] = useState<number[]>([])

  const [searchArtists, searchArtistsAction] = useSearchArtistsAction()
  useEffect(() => {
    searchArtists(debouncedInput)
  }, [debouncedInput, searchArtists])
  useEffect(() => {
    if (searchArtistsAction && isSuccess(searchArtistsAction.request)) {
      setSuggestions(
        searchArtistsAction.request.data.artist.search.map(
          (artist) => artist.id
        )
      )
    }
  }, [searchArtistsAction])
  useEffect(() => {
    if (suggestions.length === 0) {
      // eslint-disable-next-line unicorn/no-useless-undefined
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
  const artist = useSelector((state) => state.artists[id])

  const [getArtist, getArtistAction] = useGetArtistAction()
  useEffect(() => {
    if (artist === undefined || artist.id !== id) {
      getArtist(id)
    }
  }, [artist, getArtist, id])

  if (getArtistAction && isLoading(getArtistAction.request)) {
    return <div>Loading...</div>
  }
  if (!artist) return <div>No artist found with id: {id}</div>

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
