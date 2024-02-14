import { gql } from 'graphql-request';
import { FRAGMENT_LESSON } from '../../fragments/lesson';

export const GET_LESSONS_BY_COURSE_AND_MODULE = gql`
  query GET_LESSONS_BY_COURSE_AND_MODULE($courseId: String, $moduleId: String) {
    lessons: lessons_cl(
      where: { course_fb: { _eq: $courseId }, module_id: { _eq: $moduleId } }
    ) {
      ...lessonInfo
    }
  }
  ${FRAGMENT_LESSON}
`;
