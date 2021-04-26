import { FunctionComponent, h } from 'preact'
import {
  StarEmpty,
  StarFull,
  StarHalf,
} from '../../common/components/icons/Star'
import { range } from '../../common/utils/array'

export const RatingStar: FunctionComponent<{ value: number }> = ({ value }) => {
  if (value === 0) return <StarEmpty />
  if (value === 1) return <StarHalf />
  return <StarFull />
}

export const RatingStars: FunctionComponent<{ value: number }> = ({
  value,
}) => (
  <div className='flex'>
    {range(5).map((i) => (
      <RatingStar key={i} value={Math.max(value - i * 2, 0)} />
    ))}
  </div>
)
