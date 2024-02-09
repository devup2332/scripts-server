import { gql } from 'graphql-request';
import { FARGMENT_THEME } from '../../fragments/theme';

export const GET_THEMES_PER_INSTANCE = gql`
  query GET_THEMES_PER_INSTANCE($clientId: String) {
    themes: topic_cl(where: { client_id: { _eq: $clientId } }) {
      ...themeInfo
    }
  }
  ${FARGMENT_THEME}
`;
