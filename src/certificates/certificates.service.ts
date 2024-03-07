import { Injectable } from '@nestjs/common';
import { downloadCoursesMPToAnInstance } from 'src/lib/utils/certificates/downloadCertificatesPerInstance';

@Injectable()
export class CertificatesService {
  async generateCertificatesPerInstance(
    clientId: string,
    dateStart: Date,
    dateEnd: Date,
  ) {
    const response = await downloadCoursesMPToAnInstance(
      clientId,
      dateStart,
      dateEnd,
    );
    return {
      status: 200,
      response,
      clientId,
    };
  }
}
