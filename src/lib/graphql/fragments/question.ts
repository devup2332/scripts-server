import { gql } from 'graphql-request';

export const FRAGMENT_QUESTION = gql`
  fragment questionsInfo on lesson_questions_tb {
    answer
    back
    image_url
    index
    lesson_fb
    mins
    options
    secs
    text
    type
    question_fb
  }
`;
