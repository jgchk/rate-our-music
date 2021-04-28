import { FunctionComponent, h } from 'preact'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import { range } from '../utils/array'
import { RatingStar } from './RatingStars'

const RatingStarInput: FunctionComponent<{
  value: number
  onChange: (value: number) => void
}> = ({ value, onChange }) => {
  const ref = useRef<HTMLDivElement>()
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const clientRect = ref.current.getBoundingClientRect()
    setWidth(clientRect.width)
  }, [])

  const handleMouseMove = (e: MouseEvent) => {
    if (e.offsetX < width * 0.25) {
      onChange(0)
    } else if (e.offsetX < width * 0.75) {
      onChange(1)
    } else {
      onChange(2)
    }
  }

  return (
    <div className='cursor-pointer' ref={ref} onMouseMove={handleMouseMove}>
      <RatingStar value={value} />
    </div>
  )
}

export const RatingStarsInput: FunctionComponent<{
  value: number
  onChange: (value: number) => void
}> = ({ value, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => setDisplayValue(value), [value])

  return (
    <div
      className='flex'
      onClick={() => onChange(displayValue)}
      onMouseLeave={() => setDisplayValue(value)}
    >
      {range(5).map((i) => (
        <RatingStarInput
          key={i}
          value={Math.max(displayValue - i * 2, 0)}
          onChange={(v) => setDisplayValue(v + i * 2)}
        />
      ))}
    </div>
  )
}
