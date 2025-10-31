export const updateCourseSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 2 },
    },
    additionalProperties: false,
  },
};
