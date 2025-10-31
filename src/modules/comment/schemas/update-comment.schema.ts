export const updateCommentSchema = {
  body: {
    type: 'object',
    properties: {
      content: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
  },
};
