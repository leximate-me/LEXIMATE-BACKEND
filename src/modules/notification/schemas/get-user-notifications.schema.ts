export const getUserNotificationsSchema = {
  querystring: {
    type: 'object',
    properties: {
      unreadOnly: { type: 'string', enum: ['true', 'false'] },
    },
  },
};
