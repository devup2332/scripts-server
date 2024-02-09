import { gql } from 'graphql-request';

export const UPDATE_QUESTION_PER_ID = gql`
  mutation UPDATE_QUESTION(
    $questionId: String
    $questionInfo: lesson_questions_tb_set_input!
  ) {
    update_lesson_questions_tb(
      where: { question_fb: { _eq: $questionId } }
      _set: $questionInfo
    ) {
      affected_rows
    }
  }
`;
