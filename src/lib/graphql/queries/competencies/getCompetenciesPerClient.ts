import { gql } from 'graphql-request';
import { FRAGMENT_COMPETENCIE } from '../../fragments/competencie';

export const GET_COMPETENCIES_PER_CLIENT = gql`
  query GET_COMPETENCIES_PER_CLIENT($clientId: String) {
    competencies: competencies_cl(where: { client_id: { _eq: $clientId } }) {
      ...competencieInfo
    }
  }
  ${FRAGMENT_COMPETENCIE}
`;
