import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { CornerUpLeft } from '../../common/components/icons/CornerUpLeft'
import { Link } from '../../routing/components/Link'
import trackClasses from './Track.module.css'
import classes from './TracklistReleaseViewLink.module.css'

export type Props = {
  href: string
}

export const ReleaseViewLink: FunctionComponent<Props> = ({ href }) => (
  <Link className={clsx(classes.container, trackClasses.container)} href={href}>
    <div className={classes.icon}>
      <CornerUpLeft />
    </div>
    <div className={classes.text}>Release View</div>
  </Link>
)
