import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useLoginAction } from '../../auth/hooks/useAuthAction'
import classes from './Layout.module.css'

export const Layout: FunctionComponent = ({ children }) => {
  // TODO: move somewhere that makes more sense
  const [login] = useLoginAction()
  useEffect(() => login('admin', 'admin'), [login])

  return (
    <div className={clsx(classes.outer, 'dark')}>
      <div className={classes.inner}>{children}</div>
    </div>
  )
}
