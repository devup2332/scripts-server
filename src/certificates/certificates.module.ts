import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { ScriptsService } from 'src/scripts/scripts.service';

@Module({
  providers: [CertificatesService, ScriptsService],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
