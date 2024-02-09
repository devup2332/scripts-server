import { gql } from 'graphql-request';

export const FRAGMENT_LESSON = gql`
  fragment lessonInfo on lessons_cl {
    activity_id
    assign
    claps
    client_id
    competencies_json
    course_fb
    created_at
    created_by
    creating
    deleted_at
    description
    embed_json
    eval_attempts
    eval_question_to_evaluate
    hide
    hours
    html
    image_url
    index
    is_deleted
    is_individual
    is_post
    lecture
    lesson_fb
    message
    minutes
    module_id
    name
    privacy
    random
    resources_json
    rubric
    stage
    subtype
    topic_id
    type
    updated_at
    users_to_evaluate
    video
    weighing
    weight
  }
`;
