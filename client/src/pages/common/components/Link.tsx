import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import {
  Link as RouterLink,
  Props as RouterLinkProps,
} from '../../../router/Link'
import theme from '../../../theme.module.css'

export const Link: FunctionComponent<RouterLinkProps> = ({
  className,
  ...props
}) => <RouterLink className={clsx(theme.link, className)} {...props} />
