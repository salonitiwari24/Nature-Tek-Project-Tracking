import { Module } from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, LifecycleService],
  exports: [ProjectsService, LifecycleService],
})
export class ProjectsModule {}
