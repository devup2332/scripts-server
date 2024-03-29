import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';

@Module({
  providers: [ScriptsService],
  controllers: [ScriptsController],
})
export class ScriptsModule {}
