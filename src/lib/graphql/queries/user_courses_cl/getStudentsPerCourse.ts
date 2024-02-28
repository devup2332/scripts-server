import { gql } from 'graphql-request';

export const GET_STUDENTS_PER_COURSE_AND_INSTANCE = gql`
  query GET_STUDENTS_PER_COURSE_AND_INSTANCE(
    $courseId: String
    $clientId: String
  ) {
    students: user_course_cl(
      where: {
        course_fb: { _eq: $courseId }
        user: { client_id: { _eq: $clientId } }
      }
    ) {
      score
      progress
    }
  }
`;
