import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { FunctionComponent, h } from 'preact';
import Layout from './layout';
import Router from './router';

const client = new GraphQLClient({ url: '/graphql' });

const App: FunctionComponent = () => (
  <ClientContext.Provider value={client}>
    <Layout>
      <Router />
    </Layout>
  </ClientContext.Provider>
);

export default App;
