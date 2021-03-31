import { FunctionComponent } from 'preact'
import { MonthIndex, PartialDate } from '../../../state'

const formatMonth = (i: MonthIndex) => {
  switch (i) {
    case 1:
      return 'Jan'
    case 2:
      return 'Feb'
    case 3:
      return 'Mar'
    case 4:
      return 'Apr'
    case 5:
      return 'May'
    case 6:
      return 'Jun'
    case 7:
      return 'Jul'
    case 8:
      return 'Aug'
    case 9:
      return 'Sep'
    case 10:
      return 'Oct'
    case 11:
      return 'Nov'
    case 12:
      return 'Dec'
  }
}

export type Props = { releaseDate: PartialDate }

export const ReleaseDate: FunctionComponent<Props> = ({ releaseDate }) => (
  <div>
    {releaseDate.day && <span>{releaseDate.day}</span>}{' '}
    {releaseDate.month && (
      <a href={`/chart/${releaseDate.year}/${releaseDate.month}`}>
        {formatMonth(releaseDate.month)}
      </a>
    )}{' '}
    <a href={`/chart/${releaseDate.year}`}>{releaseDate.year}</a>
  </div>
)
