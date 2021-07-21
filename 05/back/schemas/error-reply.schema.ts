const schema = {
  additionalProperties: false,
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'integer' },
  },
  required: ['error', 'message', 'statusCode'],
  type: 'object',
} as const;

export default schema;
