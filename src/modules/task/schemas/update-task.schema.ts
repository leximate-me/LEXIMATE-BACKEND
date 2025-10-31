export const updateTaskSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 4 },
      description: { type: 'string', minLength: 3 },
      status: { type: 'boolean' },
      due_date: { type: 'string', format: 'date-time' },
    },
    additionalProperties: false,
  },
};
