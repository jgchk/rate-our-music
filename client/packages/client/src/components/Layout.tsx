import { FunctionComponent, h } from 'preact'
import { NavBar } from './NavBar'

export const Layout: FunctionComponent = ({ children }) => (
  <div className='w-screen h-screen'>
    <div className='w-full h-full flex flex-col align-center'>
      <NavBar />
      <div className='flex-1 w-full max-w-screen-2xl p-4'>{children}</div>
    </div>
  </div>
)
