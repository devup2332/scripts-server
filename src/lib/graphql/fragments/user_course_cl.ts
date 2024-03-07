import { gql } from 'graphql-request';

export const FRAGMENT_STUDENT = gql`
  fragment studentInfo on user_course_cl {
    score
    progress
    last_update
    user_fb
    status
    completed_at
    course_fb
  }
`;
