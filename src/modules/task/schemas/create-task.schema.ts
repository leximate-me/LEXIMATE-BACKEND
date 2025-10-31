export const createTaskSchema = {
  body: {
    type: 'object',
    required: ['title', 'description', 'due_date'],
    properties: {
      title: { type: 'string', minLength: 4 },
      description: { type: 'string', minLength: 3 },
      status: { type: 'boolean' },
      due_date: { type: 'string', format: 'date-time' },
    },
    additionalProperties: false,
  },
};
