import { ICourse } from 'src/models/course';
import graphqlClientLernit from '../graphql/client';
import { GET_INFO_COURSES_BY_INSTANCE } from '../graphql/queries/courses/getInfoCoursesByInstance';
import * as xlsx from 'xlsx';

export const getReportOfCoursesPerInstance = async (clientId: string) => {
  const { courses }: { courses: ICourse[] } = await graphqlClientLernit.request(
    GET_INFO_COURSES_BY_INSTANCE,
    {
      clientId,
    },
  );

  const dataExcel = courses.map((c) => {
    return {
      'ID CURSO': c.course_fb,
      'NOMBRE DEL CURSO': c.name,
      MODALIDAD: c.type && 'Online',
      CATALOGO: c.origin === 'tecmilenio' ? 'TECMILENIO' : 'CONTENT',
    };
  });

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(dataExcel);
  xlsx.utils.book_append_sheet(wb, ws, 'Reporte de cursos');
  xlsx.writeFile(wb, `Reporte de cursos - ${clientId}.xlsx`);
  return 'Done';
};
