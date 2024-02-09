import { gql } from 'graphql-request';

export const FARGMENT_THEME = gql`
  fragment themeInfo on topic_cl {
    name
    id: topic_fb
  }
`;
