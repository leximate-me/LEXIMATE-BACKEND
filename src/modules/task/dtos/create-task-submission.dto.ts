import { TaskStatus } from '../../../common/enums/task-status';

export class CreateTaskSubmissionDto {
  comment?: string;
  status: TaskStatus;
  qualification: number;
}
