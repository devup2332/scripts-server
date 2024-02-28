import { gql } from 'graphql-request';
import { FRAGMENT_CLIENT } from '../../fragments/client';

export const GET_ALL_CLIENTS_INFO = gql`
  query GET_ALL_CLIENTS_INFO {
    clients: clients_cl {
      ...clientInfo
    }
  }
  ${FRAGMENT_CLIENT}
`;
