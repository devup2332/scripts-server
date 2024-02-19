import { Injectable } from '@nestjs/common';
import graphqlClientLernit from 'src/lib/graphql/client';
import { GET_CLIENT_INFO } from 'src/lib/graphql/queries/clients/getClientInfo';
import { IClient } from 'src/models/client';
import { downloadCoursesMPToAnInstance } from 'src/lib/utils/downloadCoursesMPToAnInstance';
import { updateCoursesTecmilenio } from 'src/lib/utils/updateCoursesTecmilenio';
import { getReportOfCoursesPerInstance } from 'src/lib/utils/getReportOfCoursesPerInstance';

@Injectable()
export class ScriptsService {
  async downloadCoursesMPToAnInstance(clientId: string) {
    const response = await downloadCoursesMPToAnInstance(clientId);
    return {
      status: 200,
      response,
      clientId,
    };
  }

  async validateClientId(clientId: string) {
    const { clients } = await graphqlClientLernit.request<
      Promise<{ clients: IClient[] }>
    >(GET_CLIENT_INFO, { clientId });
    if (clients.length) return clients[0];
    return null;
  }

  async updateAndCreateTecmilenioCourses() {
    await updateCoursesTecmilenio();
    return {
      status: 200,
      type: 'UpdateAndCreateTecmilenioCourses',
      respose: [],
    };
  }

  async getReportOfCoursesPerInstance(clientId: string) {
    const response = await getReportOfCoursesPerInstance(clientId);
    return {
      response,
      status: 200,
    };
  }
}
