export const updatePostSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1 },
      content: { type: 'string', minLength: 2 },
    },
    additionalProperties: false,
  },
};
