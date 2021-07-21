import userSchema from './user.schema';

const schema = {
  additionalProperties: false,
  properties: {
    expire: { type: 'string' },
    id: userSchema.properties.id,
    name: { type: 'string' },
  },
  required: ['expire', 'id', 'name'],
  type: 'object',
} as const;

export default schema;
