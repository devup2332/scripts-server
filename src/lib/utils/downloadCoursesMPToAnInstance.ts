import * as xlsx from 'xlsx';
import graphqlClientLernit from '../graphql/client';
import { GET_INFO_COURSES_BY_NAMES } from '../graphql/queries/courses/getInfoCoursesByNames';
import { ICourse } from 'src/models/course';
import { GET_THEMES_PER_INSTANCE } from '../graphql/queries/themes/getThemesPerInstance';
import { ITheme } from 'src/models/theme';
import { INSERT_MP_COURSE_INTO_AN_INSTANCE } from '../graphql/mutations/marketplace_data_tb/insertNewMPCourse';
import { sleep } from './sleep';
export const downloadCoursesMPToAnInstance = async (clientId: string) => {
  const excelToReadDir = 'data.xlsx';
  const wb = xlsx.readFile(excelToReadDir);
  const data: object[] = xlsx.utils.sheet_to_json(wb.Sheets['courses']);
  const names: string[] = data.map((d) => d['Nombre de Curso'].trim());

  const { courses }: { courses: ICourse[] } = await graphqlClientLernit.request(
    GET_INFO_COURSES_BY_NAMES,
    {
      names,
    },
  );

  const { themes }: { themes: ITheme[] } = await graphqlClientLernit.request(
    GET_THEMES_PER_INSTANCE,
    {
      clientId,
    },
  );
  let index = 0;

  for (const course of courses) {
    const conf = data.find(
      (d) => d['Nombre de Curso'].trim() === course.name.trim(),
    );
    if (!conf) continue;

    const theme = themes.find(
      (t) => t.name.trim().toLowerCase() === conf['Tema'].trim().toLowerCase(),
    );

    const object = {
      topic_id: theme.id,
      privacity: 'private',
      lesson_privacy: false,
      min_progress: 100,
      min_score: 80,
      restart_time: 24,
      welcome_message: '¡Te damos la bienvenida a tu curso!',
      course_fb: course.course_fb,
      client_fb: clientId,
      available_in_client: true,
    };

    await graphqlClientLernit.request(INSERT_MP_COURSE_INTO_AN_INSTANCE, {
      object,
    });
    console.log(
      `!!!! Course Created ${course.name} - ${course.course_fb} - ${index + 1}/${courses.length}`,
    );
    index++;
    await sleep(100);
  }

  return 'Done';
};
