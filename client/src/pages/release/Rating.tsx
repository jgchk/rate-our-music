import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { Star } from 'preact-feather'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import classes from './Rating.module.css'

const range = (n: number) => [...Array.from({ length: n }).keys()]

const RatingStar: FunctionComponent<{
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
      onChange(0.5)
    } else {
      onChange(1)
    }
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove}>
      <Star
        className={clsx(
          classes.star,
          value === 0 && classes.empty,
          value === 0.5 && classes.half,
          value === 1 && classes.full
        )}
      />
    </div>
  )
}

export const Rating: FunctionComponent<{
  value: number
  onChange: (value: number) => void
}> = ({ value, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value)

  return (
    <div
      className={classes.container}
      onClick={() => onChange(displayValue)}
      onMouseLeave={() => setDisplayValue(value)}
    >
      {range(5).map((i) => (
        <RatingStar
          key={i}
          value={Math.max(displayValue - i, 0)}
          onChange={(v) => setDisplayValue(v + i)}
        />
      ))}
    </div>
  )
}
