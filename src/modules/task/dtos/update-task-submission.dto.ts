import { TaskStatus } from '../../../common/enums/task-status';

export class UpdateTaskSubmissionDto {
  comment?: string;
  status?: TaskStatus;
  qualification?: number;
}
