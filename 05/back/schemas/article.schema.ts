const schema = {
  additionalProperties: false,
  properties: {
    authorId: { type: 'string' },
    dt: { type: 'string' },
    id: { type: 'string' },
    text: { type: 'string' },
    title: { type: 'string' },
  },
  required: ['authorId', 'dt', 'id', 'text', 'title'],
  type: 'object',
} as const;

export default schema;
