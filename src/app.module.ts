import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScriptsModule } from './scripts/scripts.module';
import { ReportsModule } from './reports/reports.module';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [ConfigModule.forRoot(), ScriptsModule, ReportsModule, CertificatesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
