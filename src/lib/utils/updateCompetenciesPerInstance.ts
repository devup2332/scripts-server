import { ICourse } from 'src/models/course';
import graphqlClientLernit from '../graphql/client';
import { GET_INFO_COURSES_BY_INSTANCE } from '../graphql/queries/courses/getInfoCoursesByInstance';
import { readExcelSheet } from './methods/readExcelSheet';
import { ICompetencie } from 'src/models/competencie';
import { GET_COMPETENCIES_PER_CLIENT } from '../graphql/queries/competencies/getCompetenciesPerClient';
import { normalize } from 'path';
import { normalizeString } from './methods/normalizeString';

export const updateCompetenciesPerInstance = async (clientId: string) => {
  const dataExcel = await readExcelSheet('data.xlsx', 'courses');
  const { courses }: { courses: ICourse[] } = await graphqlClientLernit.request(
    GET_INFO_COURSES_BY_INSTANCE,
    {
      clientId,
    },
  );

  const { competencies }: { competencies: ICompetencie[] } =
    await graphqlClientLernit.request(GET_COMPETENCIES_PER_CLIENT, {
      clientId,
    });

  const coursesNotFound = [];

  for (const courseExcelInfo of dataExcel) {
    const f = courses.find(
      (c) =>
        normalizeString(c.name) ===
        normalizeString(courseExcelInfo['Nombre de Curso']),
    );

    if (!f) {
      coursesNotFound.push(courseExcelInfo);
      continue;
    }
  }
};
