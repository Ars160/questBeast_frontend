import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getToken } from '@/shared/store/useAuthStore';

const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
const wsUri = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql';

const httpLink = new HttpLink({ 
  uri: httpUri 
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return { 
    headers: { 
      ...headers, 
      authorization: token ? `${token}` : '' 
    } 
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUri,
    connectionParams: () => {
      const token = getToken();
      return {
        authorization: token ? `${token}` : '',
      };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, 
  authLink.concat(httpLink) 
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});