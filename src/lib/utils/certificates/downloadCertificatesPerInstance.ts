import graphqlClientLernit from 'src/lib/graphql/client';
import { GET_STUDENTS_PER_COURSE_AND_DATE } from 'src/lib/graphql/queries/user_courses_cl/getStudentsPerCourseAndDate';
import { IStudent } from 'src/models/student';
import * as xlsx from 'xlsx';
import * as path from 'path';
import { format } from 'date-fns';
import * as fs from 'fs-extra';
import { normalizeString } from '../methods/normalizeString';
import axios from 'axios';
import { environments } from 'src/config/environments';

export const downloadCoursesMPToAnInstance = async (
  clientId: string,
  dateStart: Date,
  dateEnd: Date,
) => {
  try {
    console.log(`====> Getting data for ${clientId}`);
    const { students }: { students: IStudent[] } =
      await graphqlClientLernit.request(GET_STUDENTS_PER_COURSE_AND_DATE, {
        dateStart,
        dateEnd,
        clientId,
      });
    const approvedStudents = students.filter((s) => {
      const {
        score,
        progress,
        completed_at,
        course: { min_progress, min_score },
      } = s;
      let approved = false;
      if (min_score !== null && min_progress !== null) {
        approved = score >= min_score && progress >= min_progress;
      } else {
        approved = score >= min_score || progress >= min_progress;
      }
      return completed_at && approved;
    });

    console.log(
      `====> Generating Excel ${clientId} for ${approvedStudents.length} students`,
    );
    const mappedData: {
      Id: string;
      Nombre: string;
      Email: string;
      Cantidad: number;
      Marketplace: number;
      Propios: number;
    }[] = [];
    for (const student of approvedStudents) {
      const {
        course: { client_id },
      } = student;
      const index = mappedData.findIndex((m) => m.Id === student.user_fb);
      if (index >= 0) {
        mappedData[index].Cantidad += 1;
        student.course.client_id === clientId
          ? (mappedData[index].Propios += 1)
          : (mappedData[index].Marketplace += 1);
      } else {
        mappedData.push({
          Id: student.user_fb,
          Nombre: student.user.full_name,
          Email: student.user.email,
          Cantidad: 1,
          Marketplace: client_id === 'content' ? 1 : 0,
          Propios: client_id === clientId ? 1 : 0,
        });
      }
    }
    const wb = xlsx.utils.book_new();
    const s = xlsx.utils.json_to_sheet(mappedData);
    xlsx.utils.book_append_sheet(wb, s, 'Cursos');
    xlsx.writeFile(wb, 'Certificados Descargados.xlsx');
    console.log('====> Excel generated');
    console.log(`====> Downloading certificates`);

    const mainPathFolder = path.resolve(
      __dirname,
      `../../../../Certificados/${clientId}`,
    );
    console.log(mainPathFolder);
    if (!fs.existsSync(mainPathFolder)) {
      console.log('Here');
      await fs.mkdir(mainPathFolder, { recursive: true });
    }
    for (const student of approvedStudents) {
      const { user, course, completed_at, user_fb, course_fb } = student;
      let response = '';
      if (course.client_id === 'content') {
        const params = {
          name: normalizeString(user.full_name),
          course: normalizeString(course.name),
          date: format(new Date(completed_at), 'dd-MM-yyyy'),
          ucid: user.user_fb,
          duration: `${course.duration} hrs`,
          modules: course.modules.length.toString(),
        };
        const searchParams = new URLSearchParams(params);
        const { data } = await axios.get(
          `${environments.CERT_SERVER_URL}${environments.CERT_LWL_PDF}?${searchParams}`,
        );
        response = data;
      } else {
        const params = {
          clientId,
          userName: user.full_name,
          courseName: course.name,
          date: format(new Date(completed_at), 'YYYY-MM-DD'),
        };
        const searchParams = new URLSearchParams(params);
        const { data } = await axios.get(
          `${environments.CERT_SERVER_URL}${environments.CERT_SERVER_ENDPOINT}?${searchParams}`,
        );
        response = data;
      }
      const cert = await axios.get(
        `${environments.CERT_SERVER_URL}${response}`,
        {
          responseType: 'arraybuffer',
        },
      );

      // const userFilePath =`${mainPathFolder}/${normalizeString(user.full_name)}`;
    }
    return [];
  } catch (err) {
    return [];
  }
};
