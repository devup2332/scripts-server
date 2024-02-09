import { gql } from 'graphql-request';
import { FRAGMENT_LESSON } from '../../fragments/lesson';

export const GET_LESSONS_BY_COURSE = gql`
  query GET_LESSONS_BY_COURSE($courseId: String) {
    lessons: lessons_cl(where: { course_fb: { _eq: $courseId } }) {
      ...lessonInfo
    }
  }
  ${FRAGMENT_LESSON}
`;
