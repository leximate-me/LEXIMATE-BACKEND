export const createPostSchema = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string', minLength: 1 },
      content: { type: 'string', minLength: 2 },
    },
    additionalProperties: false,
  },
};
