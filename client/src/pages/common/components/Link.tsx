import clsx from 'clsx'
import { FunctionComponent, JSX } from 'preact'
import theme from '../../../theme.module.css'

export const Link: FunctionComponent<JSX.HTMLAttributes<HTMLAnchorElement>> = ({
  className,
  ...props
}) => <a className={clsx(theme.link, className)} {...props} />
