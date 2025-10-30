import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { TaskStatus } from '../../../common/enums/task-status';

export class CreateTaskSubmissionDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  qualification?: number;
}
