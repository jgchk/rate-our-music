import clsx from 'clsx'
import { FunctionComponent } from 'preact'
import classes from './Layout.module.css'

export const Layout: FunctionComponent = ({ children }) => (
  <div className={clsx(classes.outer, 'dark')}>
    <div className={classes.inner}>{children}</div>
  </div>
)
