export interface ICourse {
  name: string;
  course_fb: string;
  origin: string;
  stage: number;
  client_id: string;
  topic_id: string;
  image_url: string;
  type: string;
  min_core: string;
  min_rogress: string;
  competencies_json: string[];
  ous_json: string[];
  created_by_json: object;
  instructors_json: string[];
  knowledge_json: string[];
  requirements_json: object;
  roles_json: string[];
  skills_json: object;
  tags_json: string;
  description: string;
  difficulty: string;
  duration: string;
  hide: boolean;
  language: string;
  privacity: string;
  welcome_message: string;
  reason: string;
  video_json: object;
  is_deleted: boolean;
  dc3Available: object;
  external_course_id: string;
  min_attendance: string;
  block_after_due_date: string;
  price: string;
  currency: string;
  validity: string;
  dc4Available: boolean;
  dc3_data_json: object;
  dc4_data_json: object;
  dynamic_end_days: number;
  external_url: string;
}
