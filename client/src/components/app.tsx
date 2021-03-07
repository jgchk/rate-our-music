import { FunctionComponent, h } from 'preact';
import { SessionProvider } from '../contexts/session';
import Layout from './layout';
import Router from './router';

const App: FunctionComponent = () => (
  <SessionProvider>
    <Layout>
      <Router />
    </Layout>
  </SessionProvider>
);

export default App;
