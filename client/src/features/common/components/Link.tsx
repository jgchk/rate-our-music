import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import {
  Link as RouterLink,
  Props as RouterLinkProps,
} from '../../routing/components/Link'
import classes from './Link.module.css'

export const Link: FunctionComponent<RouterLinkProps> = ({
  className,
  ...props
}) => <RouterLink className={clsx(classes.link, className)} {...props} />
