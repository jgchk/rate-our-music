import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { FunctionComponent, h } from 'preact';
import Router from './router';

const client = new GraphQLClient({ url: '/graphql' });

const App: FunctionComponent = () => (
  <ClientContext.Provider value={client}>
    <Router />
  </ClientContext.Provider>
);

export default App;
