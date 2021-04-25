import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useLoginAction } from '../../auth/hooks/useAuthAction'
import { NavBar } from '../../routing/components/NavBar'
import { clsx } from '../utils/clsx'
import classes from './Layout.module.css'

export const Layout: FunctionComponent = ({ children }) => {
  // TODO: move somewhere that makes more sense
  const [login] = useLoginAction()
  useEffect(() => login('admin', 'admin'), [login])

  return (
    <div className={clsx(classes.outer, 'dark')}>
      <NavBar />
      <div className={classes.inner}>{children}</div>
    </div>
  )
}
