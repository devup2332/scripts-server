import { gql } from 'graphql-request';

export const FRAGMENT_COURSE = gql`
  fragment courseInfo on courses_cl {
    name
    course_fb
    origin
    stage
    topic_id
    image_url
    type
    client_id
    stage
    min_score
    min_progress
    competencies_json
    ous_json
    created_by_json
    instructors_json
    knowledge_json
    requirements_json
    roles_json
    skills_json
    tags_json
    description
    difficulty
    duration
    hide
    language
    privacity
    welcome_message
    reason
    video_json
    is_deleted
    dc3Available
    external_course_id
    min_attendance
    block_after_due_date
    price
    currency
    validity
    dc4Available
    dc3_data_json
    dc4_data_json
    dynamic_end_days
    external_url
  }
`;
