import { IsString, IsBoolean, MinLength, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  due_date?: string;
}
