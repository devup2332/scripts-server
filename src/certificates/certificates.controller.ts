import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { ScriptsService } from 'src/scripts/scripts.service';

@Controller('certificates')
export class CertificatesController {
  constructor(
    private _certificatesSrv: CertificatesService,
    private _scriptSrv: ScriptsService,
  ) {}
  @Post('generateCertificatesPerInstance')
  async generateCertificatesPerInstance(
    @Query('clientId') clientId: string,
    @Query('dateStart') dateStart: Date,
    @Query('dateEnd') dateEnd: Date,
  ) {
    const client = await this._scriptSrv.validateClientId(clientId);

    if (!client)
      throw new HttpException('Client does not Exist', HttpStatus.BAD_REQUEST);
    return this._certificatesSrv.generateCertificatesPerInstance(
      clientId,
      dateStart,
      dateEnd,
    );
  }
}
