import { TaskStatus } from '../../../common/enums/task-status.enum';

export const createTaskSubmissionSchema = {
  body: {
    type: 'object',
    properties: {
      comment: { type: 'string' },
    },
    additionalProperties: false,
  },
};
