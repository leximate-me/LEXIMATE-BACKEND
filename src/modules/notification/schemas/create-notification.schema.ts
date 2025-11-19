export const createNotificationSchema = {
  body: {
    type: 'object',
    required: ['userId', 'type', 'title', 'message'],
    properties: {
      userId: { type: 'string', format: 'uuid' },
      type: { 
        type: 'string',
        enum: ['task_assigned', 'task_submitted', 'comment_added', 'post_created']
      },
      title: { type: 'string', minLength: 1, maxLength: 200 },
      message: { type: 'string', minLength: 1 },
      data: { type: 'object' },
    },
  },
};
