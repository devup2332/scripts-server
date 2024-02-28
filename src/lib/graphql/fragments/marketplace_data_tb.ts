import { gql } from 'graphql-request';

export const FRAGMENT_MARKETPLACE_DATA_TB = gql`
  fragment mpDataTbInfo on marketplace_data_tb {
    id
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
  }
`;
