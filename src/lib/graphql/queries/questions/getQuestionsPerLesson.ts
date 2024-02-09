import { gql } from 'graphql-request';
import { FRAGMENT_QUESTION } from '../../fragments/question';

export const GET_QUESTIONS_PER_LESSON = gql`
  query GET_QUESTIONS_PER_LESSON($lessonId: String) {
    questions: lesson_questions_tb(where: { lesson_fb: { _eq: $lessonId } }) {
      ...questionsInfo
    }
  }
  ${FRAGMENT_QUESTION}
`;
