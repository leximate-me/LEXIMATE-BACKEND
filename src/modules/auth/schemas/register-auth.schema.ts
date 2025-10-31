export const registerAuthSchema = {
  body: {
    type: 'object',
    required: [
      'first_name',
      'last_name',
      'dni',
      'institute',
      'phone_number',
      'birth_date',
      'user_name',
      'email',
      'password',
    ],
    properties: {
      first_name: { type: 'string', minLength: 3 },
      last_name: { type: 'string', minLength: 3 },
      dni: { type: 'string', minLength: 7 },
      institute: { type: 'string', minLength: 3 },
      phone_number: { type: 'string', minLength: 10 },
      birth_date: { type: 'string', format: 'date' },
      user_name: { type: 'string', minLength: 4 },
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
        minLength: 8,
        pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-_?*$])',
      },
    },
  },
};
