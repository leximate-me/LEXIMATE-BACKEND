export const createChatSchema = {
  body: {
    type: 'object',
    required: ['userIds'],
    properties: {
      userIds: {
        type: 'array',
        items: { type: 'string' },
        minItems: 3,
      },
    },
  },
};
