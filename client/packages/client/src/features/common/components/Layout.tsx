import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useLoginAction } from '../../auth/hooks/useAuthAction'
import { NavBar } from '../../routing/components/NavBar'

export const Layout: FunctionComponent = ({ children }) => {
  // TODO: move somewhere that makes more sense
  const [login] = useLoginAction()
  useEffect(() => login('admin', 'admin'), [login])

  return (
    <div className='w-screen h-screen'>
      <div className='w-full h-full flex flex-col align-center'>
        <NavBar />
        <div className='flex-1 w-full max-w-screen-2xl'>{children}</div>
      </div>
    </div>
  )
}
