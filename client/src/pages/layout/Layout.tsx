import { FunctionComponent } from 'preact'
import classes from './Layout.module.css'

export const Layout: FunctionComponent = ({ children }) => (
  <div className={classes.outer}>
    <div className={classes.inner}>{children}</div>
  </div>
)
