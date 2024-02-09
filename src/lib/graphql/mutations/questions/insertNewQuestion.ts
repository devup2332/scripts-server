import { gql } from 'graphql-request';

export const INSERT_NEW_QUESTION = gql`
  mutation INSERT_NEW_QUESTION(
    $questionInfo: lesson_questions_tn_insert_input!
  ) {
    insert_lesson_questions_tb_one(
      object: $questionInfo
      on_conflict: {
        constraint: lesson_questions_tn_pkey
        update_columns: [text, options]
      }
    ) {
      question_fb
    }
  }
`;
