import { gql } from 'graphql-request';
import { FRAGMENT_COURSE } from '../../fragments/course';

export const GET_INFO_COURSES_BY_INSTANCE = gql`
  query GET_INFO_COURSES_BY_INSTANCE($clientId: String) {
    courses: courses_cl(
      where: {
        client_id: { _eq: $clientId }
        course_fb: { _eq: "pmC6pOoxyP6b6yQ92xR9" }
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
