import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';

const makeApolloClient = (token) => {
  // create an apollo link instance, a network interface for apollo client
  const link = new HttpLink({
    uri: 'https://gamburd-kyoto-graphql.herokuapp.com/v1/graphql',
    headers: {
      'x-hasura-admin-secret': `${token}`,
    },
  });

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  // create an inmemory cache instance for caching graphql data
  const cache = new InMemoryCache();
  // instantiate apollo client with apollo link instance and cache instance
  const client = new ApolloClient({
    link,
    cache,
    defaultOptions,
  });
  return client;
};
export default makeApolloClient;
