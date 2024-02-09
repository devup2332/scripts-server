import { gql } from 'graphql-request';
import { FRAGMENT_COURSE } from '../../fragments/course';

export const GET_COURSES_TECMILENIO_IN_MP = gql`
  query GET_COURSES_TECMILENIO_IN_MP {
    courses: courses_cl(
      where: {
        client_id: { _eq: "content" }
        stage: { _gte: 7 }
        origin: { _eq: "tecmilenio" }
        is_deleted: { _eq: false }
      }
    ) {
      ...courseInfo
    }
  }
  ${FRAGMENT_COURSE}
`;
