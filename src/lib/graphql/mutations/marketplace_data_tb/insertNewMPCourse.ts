import { gql } from 'graphql-request';

export const INSERT_MP_COURSE_INTO_AN_INSTANCE = gql`
  mutation INSERT_MP_COURSE_INTO_AN_INSTANCE(
    $object: marketplace_data_tb_insert_input!
  ) {
    insert_marketplace_data_tb_one(
      object: $object
      on_conflict: {
        constraint: marketplace_data_tb_pkey
        update_columns: [
          client_fb
          course_fb
          available_in_client
          competencies_json
          roles_json
          lesson_privacy
          min_progress
          min_score
          ous_json
          privacity
          topic_id
          welcome_message
          competencies_levels
          restart_time
          available_dc3_marketplace
        ]
      }
    ) {
      id
      client_fb
      course_fb
    }
  }
`;
