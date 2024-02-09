import { gql } from 'graphql-request';

export const INSERT_NEW_LESSON = gql`
  mutation INSERT_NEW_LESSON($lessonInfo: lessons_cl_insert_input!) {
    insert_lessons_cl_one(
      object: $lessonInfo
      on_conflict: {
        constraint: lessons_cl_pkey
        update_columns: [name, description, index]
      }
    ) {
      lesson_fb
    }
  }
`;
