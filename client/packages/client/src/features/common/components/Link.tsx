import { FunctionComponent, h } from 'preact'
import {
  Link as RouterLink,
  Props as RouterLinkProps,
} from '../../routing/components/Link'
import { clsx } from '../utils/clsx'

export const Link: FunctionComponent<RouterLinkProps> = ({
  className,
  ...props
}) => <RouterLink className={clsx('font-medium', className)} {...props} />
