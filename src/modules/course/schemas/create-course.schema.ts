export const createCourseSchema = {
  body: {
    type: 'object',
    required: ['name', 'description'],
    properties: {
      name: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 2 },
    },
    additionalProperties: false,
  },
};
