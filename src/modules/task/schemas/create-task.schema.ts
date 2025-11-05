export const createTaskSchema = {
  body: {
    type: 'object',
    required: ['title', 'description', 'due_date'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      due_date: { type: 'string' },
    },
    additionalProperties: false,
  },
};
