import { FunctionComponent } from 'preact'
import { CornerUpLeft } from 'preact-feather'
import { Link } from '../../../router/Link'
import trackClasses from './Track.module.css'
import classes from './TracklistReleaseViewLink.module.css'

export type Props = {
  href: string
}

export const ReleaseViewLink: FunctionComponent<Props> = ({ href }) => (
  <Link className={trackClasses.container} href={href}>
    <div className={classes.icon}>
      <CornerUpLeft />
    </div>
    <div className={classes.text}>Release View</div>
  </Link>
)
