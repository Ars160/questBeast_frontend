import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '@/shared/store/useAuthStore';

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return { headers: { ...headers, authorization: token ? `${token}` : '' } };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
