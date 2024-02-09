import { gql } from 'graphql-request';
import { FRAGMENT_CLIENT } from '../../fragments/client';

export const GET_CLIENT_INFO = gql`
  query GET_CLIENT_INFO($clientId: String) {
    clients: clients_cl(where: { client_fb: { _eq: $clientId } }) {
      ...clientInfo
    }
  }
  ${FRAGMENT_CLIENT}
`;
