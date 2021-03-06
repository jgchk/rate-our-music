import { FunctionComponent, h } from 'preact';
import NavBar from './nav-bar';

const Layout: FunctionComponent = ({ children }) => (
  <>
    <NavBar />

    <main>
      {children}
    </main>
  </>
);

export default Layout;
