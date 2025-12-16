import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;
