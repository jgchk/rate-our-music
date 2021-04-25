import { FunctionComponent, h } from 'preact'
import classes from './NavBar.module.css'

export const NavBar: FunctionComponent = () => (
  <div className={classes.container}>
    <div className={classes.inner}>rate our music</div>
  </div>
)
