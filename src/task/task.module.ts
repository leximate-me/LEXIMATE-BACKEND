import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskSubmission } from './entities/task-submission.entity';
import { SubmissionFile } from './entities/submission-file.entity';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([Task, TaskSubmission, SubmissionFile])],
})
export class TaskModule {}
