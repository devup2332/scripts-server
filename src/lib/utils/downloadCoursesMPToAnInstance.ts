import * as xlsx from 'xlsx';
import graphqlClientLernit from '../graphql/client';
import { ICourse } from 'src/models/course';
import { GET_THEMES_PER_INSTANCE } from '../graphql/queries/themes/getThemesPerInstance';
import { ITheme } from 'src/models/theme';
import { UPSERT_MP_COURSE_INTO_AN_INSTANCE } from '../graphql/mutations/marketplace_data_tb/insertNewMPCourse';
import { sleep } from './methods/sleep';
import { GET_COMPETENCIES_PER_CLIENT } from '../graphql/queries/competencies/getCompetenciesPerClient';
import { ICompetencie } from 'src/models/competencie';
import { getLevelsPerInstance } from './getLevelsPerInstance';
import { normalizeString } from './methods/normalizeString';
import { readExcelSheet } from './methods/readExcelSheet';
import { GET_INFO_COURSES_BY_INSTANCE } from '../graphql/queries/courses/getInfoCoursesByInstance';
import { UPDATE_COURSE_INFO } from '../graphql/mutations/courses/update_courses_cl';
import * as path from 'path';

export const downloadCoursesMPToAnInstance = async (clientId: string) => {
  console.log(`=====> Reading Excel`);
  const uri = path.resolve(__dirname, '../../../data2.xlsx');
  const data = readExcelSheet(uri, 'Cursos');

  console.log(`=====> Getting info from hasura`);
  const { courses: coursesMP }: { courses: ICourse[] } =
    await graphqlClientLernit.request(GET_INFO_COURSES_BY_INSTANCE, {
      clientId: 'content',
    });
  const { courses: coursesInstance }: { courses: ICourse[] } =
    await graphqlClientLernit.request(GET_INFO_COURSES_BY_INSTANCE, {
      clientId,
    });

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

  const levels = await getLevelsPerInstance(clientId);
  if (!levels || !levels.length) return console.log('Levels not found');
  console.log({ levels });
  let index = 0;

  const notf = [];
  console.log(`=====> Updating courses ${data.length}`);
  for (const courseExcelInfo of data) {
    const name = courseExcelInfo['Nombre de Curso'];
    const course = [...coursesMP, ...coursesInstance].find(
      (c) => normalizeString(c.name) === normalizeString(name),
    );
    if (!course) {
      console.log(`Course not found ${name}`);
      notf.push(`Nombre ->${name}`);
      continue;
    }
    console.log(`UPDATING COURSE ${course.name}`);
    const confs = data.filter((d) => name === d['Nombre de Curso']);

    const theme = themes.find((t) => {
      return (
        normalizeString(t.name) === normalizeString(confs[0]['Tema'] || '')
      );
    });
    if (!theme) console.log(`Theme not found ${confs[0]['Tema']}`);
    // Setting competencies info

    const competenciesLevels = [];
    for (const con of confs) {
      const listComp = con['Competencia (as)'].split(',').map((c) => c.trim());

      const lvl = levels.find((l) => {
        const lName = l.name.split(' - ')[0];
        return normalizeString(lName) === normalizeString(con['Niveles']);
      });

      if (!lvl) {
        console.log(`Level not found ${con['Niveles']}`);
        notf.push(`Niveles ->${con['Niveles']}`);
        continue;
      }
      for (const com of listComp) {
        const comp = competencies.find(
          (c) => normalizeString(c.name) === normalizeString(com),
        );
        if (!comp) {
          console.log(`Competencie not found ${con['Competencia']}`);
          notf.push(`Competencia ->${con['Competencia (as)']}`);
          continue;
        }
        competenciesLevels.push({
          competencieName: comp.name,
          competencieId: comp.competencies_fb,
          levels: [lvl],
        });
      }
    }
    let object: any = {};
    if (!theme) {
      object = {
        topic_id: '',
        course_fb: course.course_fb,
        client_fb: clientId,
        competencies_levels: competenciesLevels,
        privacity: 'public',
        lesson_privacy: false,
        min_score: 80,
        min_progress: 100,
        restart_time: 36,
        available_in_client: true,
        welcome_message: '¡Te damos la bienvenida a tu curso!',
      };
    } else {
      object = {
        topic_id: theme.id,
        course_fb: course.course_fb,
        client_fb: clientId,
        competencies_levels: competenciesLevels,
        privacity: 'public',
        lesson_privacy: false,
        min_score: 80,
        min_progress: 100,
        restart_time: 36,
        available_in_client: true,
        welcome_message: '¡Te damos la bienvenida a tu curso!',
      };
    }
    console.log({ object });
    index++;
    if (course.client_id === clientId) {
      const newInfo = {
        competencies_levels: competenciesLevels,
        topic_id: theme ? theme.id : '',
      };
      if (competenciesLevels.length === 0) delete newInfo.competencies_levels;
      await graphqlClientLernit.request(UPDATE_COURSE_INFO, {
        courseId: course.course_fb,
        newInfo,
      });
    } else {
      if (competenciesLevels.length === 0) delete object.competencies_levels;
      await graphqlClientLernit.request(UPSERT_MP_COURSE_INTO_AN_INSTANCE, {
        object,
      });
    }

    console.log(
      `!!!! Course Created ${course.name} - ${course.course_fb} - ${index + 1} of ${data.length}`,
    );
    await sleep(500);
  }
  console.log({ notf: notf });
  return 'Done';
};
