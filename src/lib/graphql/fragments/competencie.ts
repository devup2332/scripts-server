import { gql } from 'graphql-request';

export const FRAGMENT_COMPETENCIE = gql`
  fragment competencieInfo on competencies_cl {
    name
    created_at
    competencies_fb
  }
`;
