import { gql } from 'graphql-request';
import { FRAGMENT_COURSE } from '../../fragments/course';

export const GET_INFO_COURSES_BY_NAMES = gql`
  query GET_INFO_COURSES_BY_NAMES($names: [String]) {
    courses: courses_cl(
      where: {
        name: { _in: $names }
        stage: { _gte: 7 }
        client_id: { _in: ["content", "demo", "team"] }
        is_deleted: { _eq: false }
      }
    ) {
      ...courseInfo
    }
  }
  ${FRAGMENT_COURSE}
`;
