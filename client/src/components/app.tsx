import { FunctionComponent, h } from 'preact';
import { SessionProvider } from '../contexts/session';
import Layout from './layout';

const App: FunctionComponent = () => (
  <SessionProvider>
    <Layout />
  </SessionProvider>
);

export default App;
