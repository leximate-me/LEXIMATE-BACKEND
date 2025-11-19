import { TaskStatus } from '../../../common/enums/task-status.enum';

export class UpdateTaskSubmissionDto {
  comment?: string;
  status?: TaskStatus;
  qualification?: number;
}
