import * as xlsx from 'xlsx';
import graphqlClientLernit from '../graphql/client';
import { GET_INFO_COURSES_BY_NAMES } from '../graphql/queries/courses/getInfoCoursesByNames';
import { ICourse } from 'src/models/course';
import { GET_THEMES_PER_INSTANCE } from '../graphql/queries/themes/getThemesPerInstance';
import { ITheme } from 'src/models/theme';
import { INSERT_MP_COURSE_INTO_AN_INSTANCE } from '../graphql/mutations/marketplace_data_tb/insertNewMPCourse';
import { sleep } from './sleep';
import { GET_COMPETENCIES_PER_CLIENT } from '../graphql/queries/competencies/getCompetenciesPerClient';
import { ICompetencie } from 'src/models/competencie';
import { getLevelsPerInstance } from './getLevelsPerInstance';
import { normalizeString } from './normalizeString';
export const downloadCoursesMPToAnInstance = async (clientId: string) => {
  const excelToReadDir = 'data2.xlsx';
  const wb = xlsx.readFile(excelToReadDir);
  const data: object[] = xlsx.utils.sheet_to_json(wb.Sheets['courses']);
  const names: string[] = data.map((d) => d['Nombre de Curso'].trim());

  const { courses }: { courses: ICourse[] } = await graphqlClientLernit.request(
    GET_INFO_COURSES_BY_NAMES,
    {
      names,
    },
  );

  const { competencies }: { competencies: ICompetencie[] } =
    await graphqlClientLernit.request(GET_COMPETENCIES_PER_CLIENT, {
      clientId,
    });
  const { themes }: { themes: ITheme[] } = await graphqlClientLernit.request(
    GET_THEMES_PER_INSTANCE,
    {
      clientId,
    },
  );

  const levelsInstance = await getLevelsPerInstance(clientId);
  if (!levelsInstance.length) return;
  let index = 0;
  const mp = courses
    .filter((c) => c.client_id !== 'content')
    .map((c) => c.client_id);
  const notFound = data.filter((d) => {
    return !courses.find((c) => c.name.trim() === d['Nombre de Curso'].trim());
  });

  const workbook = xlsx.utils.book_new();
  const s = xlsx.utils.json_to_sheet(notFound);
  xlsx.utils.book_append_sheet(workbook, s, 'no encontrados');
  xlsx.writeFile(workbook, `no-encontrados-${clientId}.xlsx`);

  for (const course of courses) {
    const conf = data.filter(
      (d) => d['Nombre de Curso'].trim() === course.name.trim(),
    );
    if (!conf.length) continue;

    const theme = themes.find(
      (t) =>
        t.name.trim().toLowerCase() === conf[0]['Tema'].trim().toLowerCase(),
    );
    if (!theme) console.log(`!!!! Theme not found ${theme.name}`);

    // Setting competencies info

    const competenciesLevels = [];
    conf.forEach((c) => {
      const cc = (c['Competencia (as)'] as string)
        .split(',')
        .map((c) => normalizeString(c));
      cc.forEach((cExcel) => {
        const comp = competencies.find(
          (c) => normalizeString(c.name) === cExcel,
        );
        if (!comp) return console.log(`Competencie not found ${cExcel}`);
        competenciesLevels.push({
          competencieName: comp.name,
          competencieId: comp.competencies_fb,
          levels: levelsInstance,
        });
      });
    });

    const object = {
      topic_id: theme.id,
      privacity: 'public',
      lesson_privacy: false,
      min_progress: 100,
      min_score: 80,
      restart_time: 24,
      welcome_message: '¡Te damos la bienvenida a tu curso!',
      course_fb: course.course_fb,
      client_fb: clientId,
      available_in_client: true,
      competencies_levels: competenciesLevels,
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
