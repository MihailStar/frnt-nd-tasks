import { FastifyInstance } from 'fastify';
import fastifyMultipart from 'fastify-multipart';
import md5 from 'md5';

import errorSchema from '../schemas/error-reply.schema';
import Users from '../models/users.model';
import { packData } from '../utils/token';

async function route(fastify: FastifyInstance): Promise<void> {
  fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId: '#authSharedSchema',
    limits: {
      files: 0,
    },
  });

  fastify.post<{
    Body: { login: { value: string }; password: { value: string } };
  }>(
    '/js-6-api/auth.php',
    {
      schema: {
        body: {
          additionalProperties: false,
          properties: {
            login: { $ref: '#authSharedSchema' },
            password: { $ref: '#authSharedSchema' },
          },
          required: ['login', 'password'],
          type: 'object',
        },
        response: {
          200: {
            additionalProperties: false,
            properties: {
              statusCode: { type: 'integer' },
              token: { type: 'string' },
            },
            required: ['statusCode', 'token'],
            type: 'object',
          },
          403: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const {
        login: { value: login },
        password: { value: password },
      } = request.body;
      const user = await Users.getByEmail(login);

      // TODO: replace md5 to bcrypt
      if (user === null || user.password !== md5(password)) {
        reply.code(403);

        return {
          statusCode: 403,
          error: 'Forbidden',
          message: 'credential not valid',
        };
      }

      return {
        statusCode: 200,
        token: packData({
          expire: `${Date.now() + 1000 * 60 * 60 * 3}`,
          id: user.id,
          name: user.name,
        }),
      };
    }
  );
}

export default route;
