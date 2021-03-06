import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { FunctionComponent, h } from 'preact';
import Login from './login';

const client = new GraphQLClient({ url: '/graphql' });

const App: FunctionComponent = () => (
  <ClientContext.Provider value={client}>
    <Login />
  </ClientContext.Provider>
);

export default App;
