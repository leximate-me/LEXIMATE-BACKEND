import { TaskStatus } from '../../../common/enums/task-status.enum';

export const updateTaskSubmissionSchema = {
  body: {
    type: 'object',
    properties: {
      comment: { type: 'string' },
      status: { type: 'string', enum: Object.values(TaskStatus) },
      qualification: { type: 'number' },
    },
    additionalProperties: false,
  },
};
