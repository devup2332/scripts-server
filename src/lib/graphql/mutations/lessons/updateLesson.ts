import { gql } from 'graphql-request';

export const UPDATE_LESSON_BY_ID = gql`
  mutation UPDATE_LESSON_BY_ID(
    $lessonId: String
    $newInfo: lessons_cl_set_input!
  ) {
    update_lessons_cl_(
      where: { lesson_fb: { _eq: $lessonId } }
      _set: $newInfo
    ) {
      affected_rows
    }
  }
`;
