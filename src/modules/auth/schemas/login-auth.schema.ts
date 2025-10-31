export const loginAuthSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
        minLength: 8,
        description: 'Password must be at least 8 characters long.',
      },
    },
  },
};
