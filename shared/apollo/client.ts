import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getToken } from '@/shared/store/useAuthStore';

// HTTP link для queries и mutations
const httpLink = new HttpLink({ 
  uri: 'http://localhost:4000/graphql' 
});

// Auth link для HTTP запросов
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return { 
    headers: { 
      ...headers, 
      authorization: token ? `${token}` : '' 
    } 
  };
});

// WebSocket link для subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = getToken();
      return {
        authorization: token ? `${token}` : '',
      };
    },
  })
);

// Split link: WebSocket для subscriptions, HTTP для остального
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // ✅ subscriptions идут через WebSocket
  authLink.concat(httpLink) // ✅ queries/mutations через HTTP
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});