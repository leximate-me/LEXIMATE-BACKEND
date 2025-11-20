export const notificationIdSchema = {
  params: {
    type: 'object',
    required: ['notificationId'],
    properties: {
      notificationId: { type: 'string', format: 'uuid' },
    },
  },
};
