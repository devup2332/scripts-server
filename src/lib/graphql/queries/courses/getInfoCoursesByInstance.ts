import { gql } from 'graphql-request';
import { FRAGMENT_COURSE } from '../../fragments/course';

export const GET_INFO_COURSES_BY_INSTANCE = gql`
  query GET_INFO_COURSES_BY_INSTANCE($clientId: String) {
    courses: courses_cl(
      where: {
        client_id: { _eq: $clientId }
        stage: { _gte: 7 }
        is_deleted: { _eq: false }
        type: { _eq: "OL" }
      }
    ) {
      ...courseInfo
    }
  }
  ${FRAGMENT_COURSE}
`;
