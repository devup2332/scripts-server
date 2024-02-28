import { ICourse } from './course';

export interface IMarketplaceDataTb {
  id: string;
  client_fb: string;
  course_fb: string;
  available_in_client: boolean;
  competencies_json: string[];
  roles_json: string[];
  lesson_privacy: string;
  min_progress: number;
  min_score: number;
  ous_json: string[];
  privacity: string;
  topic_id: string;
  welcome_message: string;
  competencies_levels: object[];
  restart_time: number;
  available_dc3_marketplace: boolean;
  courses_cl: ICourse;
}
