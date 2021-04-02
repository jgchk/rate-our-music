import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import { Star } from 'preact-feather'
import { range } from '../../../utils/array'
import classes from './RatingStars.module.css'

export const RatingStar: FunctionComponent<{ value: number }> = ({ value }) => (
  <Star
    className={clsx(
      classes.star,
      value === 0 && classes.empty,
      value === 0.5 && classes.half,
      value === 1 && classes.full
    )}
  />
)

export const RatingStars: FunctionComponent<{ value: number }> = ({
  value,
}) => (
  <div className={classes.container}>
    {range(5).map((i) => (
      <RatingStar key={i} value={Math.max(value - i, 0)} />
    ))}
  </div>
)
