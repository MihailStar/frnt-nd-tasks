const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string' },
    id: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'id', 'name', 'password'],
  type: 'object',
} as const;

export default schema;
