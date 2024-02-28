import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ScriptsService } from './scripts.service';

@Controller('scripts')
export class ScriptsController {
  constructor(private _scriptSrv: ScriptsService) {}

  @Post('script1/:clientId')
  async downloadCoursesMPToAnInstance(@Param('clientId') clientId: string) {
    const client = await this._scriptSrv.validateClientId(clientId);

    if (!client) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    return this._scriptSrv.downloadCoursesMPToAnInstance(clientId);
  }

  @Get('script2')
  async updateAndCreateTecmilenioCourses() {
    return this._scriptSrv.updateAndCreateTecmilenioCourses();
  }
  @Get('script3/:clientId')
  async getReportOfCoursesPerInstance(@Param('clientId') clientId: string) {
    return this._scriptSrv.getReportOfCoursesPerInstance(clientId);
  }

  @Get('reportExcel/reportMPCourses')
  async getReportOfAllCoursesMP() {
    return this._scriptSrv.getReportOfAllCoursesMP();
  }
}
