import { gql } from 'graphql-request';

export const FRAGMENT_CLIENT = gql`
  fragment clientInfo on clients_cl {
    name
    client_fb
    hasTecmilenioCatalog
  }
`;
