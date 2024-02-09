import { gql } from 'graphql-request';

export const DELETING_QUESTION_PER_ID = gql`
  mutation DELETING_QUESTION_PER_ID($questionId: String) {
    delete_lesson_questions_tb(where: { question_fb: { _eq: $questionId } }) {
      affected_rows
    }
  }
`;
