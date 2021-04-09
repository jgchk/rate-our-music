import { FunctionComponent, h } from 'preact'
import { Star } from '../../common/components/icons/Star'
import { range } from '../../common/utils/array'
import { clsx } from '../../common/utils/clsx'
import classes from './RatingStars.module.css'

export const RatingStar: FunctionComponent<{ value: number }> = ({ value }) => (
  <Star
    className={clsx(
      classes.star,
      value === 0 && classes.empty,
      value === 1 && classes.half,
      value === 2 && classes.full
    )}
  />
)

export const RatingStars: FunctionComponent<{ value: number }> = ({
  value,
}) => (
  <div className={classes.container}>
    {range(5).map((i) => (
      <RatingStar key={i} value={Math.max(value - i * 2, 0)} />
    ))}
  </div>
)
