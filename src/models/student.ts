import { ICourse } from './course';
import { IUser } from './user';

export interface IStudent {
  score: number;
  progress: number;
  created_at: string;
  last_update: string;
  user_fb: string;
  status: string;
  completed_at: string;
  course_fb: string;
  course: ICourse;
  user: IUser;
}
