import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScriptsModule } from './scripts/scripts.module';

@Module({
  imports: [ConfigModule.forRoot(), ScriptsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
