import { IMarketplaceDataTb } from 'src/models/marketplace_data_tb';
import graphqlClientLernit from '../graphql/client';
import { GET_COURSES_MP_PER_INSTANCE } from '../graphql/queries/marketplace_data_tb/getCoursesMPperInstance';
import { IClient } from 'src/models/client';
import { GET_CLIENT_INFO } from '../graphql/queries/clients/getClientInfo';
import { GET_ALL_CLIENTS_INFO } from '../graphql/queries/clients/getAllClientsInfo';
import { GET_STUDENTS_PER_COURSE_AND_INSTANCE } from '../graphql/queries/user_courses_cl/getStudentsPerCourse';
import { IStudent } from 'src/models/student';
import * as xlsx from 'xlsx';

export const getReportOfCoursesMPperInstance = async () => {
  const { clients }: { clients: IClient[] } =
    await graphqlClientLernit.request(GET_ALL_CLIENTS_INFO);

  const c = clients.filter((c) => c.hasTecmilenioCatalog);
  const wb = xlsx.utils.book_new();
  for (const client of c) {
    console.log(`====> ${client.client_fb}`);
    const { courses }: { courses: IMarketplaceDataTb[] } =
      await graphqlClientLernit.request(GET_COURSES_MP_PER_INSTANCE, {
        clientId: client.client_fb,
      });
    const dataSheet = [];
    for (const course of courses) {
      console.log(`----- ${course.courses_cl.name}`);
      const { students }: { students: IStudent[] } =
        await graphqlClientLernit.request(
          GET_STUDENTS_PER_COURSE_AND_INSTANCE,
          {
            clientId: client.client_fb,
            courseId: course.course_fb,
          },
        );
      console.log(`----- ${students.length}`);
      const mappedUsers = students.map(({ progress }) => ({
        status:
          progress === 0
            ? 'Inactivo'
            : progress > 0 && progress < 100
              ? 'En progreso'
              : progress === 100
                ? 'Completado'
                : 'Inactivo',
      }));
      dataSheet.push({
        'Id del Curso': course.course_fb,
        'Nombre del Curso': course.courses_cl.name,
        'Estudiantes Inactivos': mappedUsers.filter(
          (u) => u.status === 'Inactivo',
        ).length,
        'Estudiantes en Progreso': mappedUsers.filter(
          (u) => u.status === 'En progreso',
        ).length,
        'Estudiantes Completados': mappedUsers.filter(
          (u) => u.status === 'Completado',
        ).length,
        'Total de Estudiantes': mappedUsers.length,
      });
    }

    const s = xlsx.utils.json_to_sheet(dataSheet);
    xlsx.utils.book_append_sheet(wb, s, client.client_fb);
  }
  xlsx.writeFile(wb, 'Reporte de Cursos.xlsx');
  return [];
};
