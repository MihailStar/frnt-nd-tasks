import { FastifyInstance } from 'fastify';
import createError from 'fastify-error';

import articleSchema from '../schemas/article.schema';
import errorSchema from '../schemas/error-reply.schema';
import Articles, { Article } from '../models/articles.model';
import { getData } from '../utils/token';

async function route(fastify: FastifyInstance): Promise<void> {
  fastify.get<{
    Querystring: { id?: Article['id'] };
  }>(
    '/js-6-api/articles.php',
    {
      schema: {
        querystring: {
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
          },
          type: 'object',
        },
        response: {
          200: {
            additionalProperties: false,
            properties: {
              statusCode: { type: 'integer' },
              res: {
                anyOf: [
                  articleSchema,
                  {
                    type: 'array',
                    items: articleSchema,
                  },
                ],
              },
            },
            required: ['statusCode', 'res'],
            type: 'object',
          },
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      if (request.query.id === undefined) {
        return {
          statusCode: 200,
          res: await Articles.getAll(),
        };
      }

      const article = await Articles.getById(request.query.id);

      if (article === null) {
        reply.code(404);

        return {
          statusCode: 404,
          error: 'Not Found',
          message: 'article not found',
        };
      }

      return {
        statusCode: 200,
        res: article,
      };
    }
  );

  fastify.delete<{
    Querystring: { id: Article['id'] };
    Body: { userId: Article['authorId'] };
  }>(
    '/js-6-api/articles.php',
    {
      schema: {
        querystring: {
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
          type: 'object',
        },
        body: {
          additionalProperties: false,
          properties: {
            userId: { type: 'string' },
          },
          required: ['userId'],
          type: 'object',
        },
        response: {
          200: {
            additionalProperties: false,
            properties: {
              statusCode: { type: 'integer' },
              res: articleSchema,
            },
            required: ['statusCode', 'res'],
            type: 'object',
          },
          403: errorSchema,
          404: errorSchema,
        },
      },
      preValidation: async (request, reply) => {
        const { authorization } = request.headers;
        const AuthorizationError = createError(
          'FST_AUTHORIZATION',
          'authorization not valid',
          403
        );

        if (authorization === undefined) {
          throw new AuthorizationError();
        }

        try {
          const { id: userId } = getData(authorization);

          if (request.body instanceof Object) {
            request.body.userId = userId;
          } else {
            request.body = { userId };
          }
        } catch (error) {
          throw new AuthorizationError();
        }
      },
    },
    async (request, reply) => {
      const article = await Articles.delById(
        request.query.id,
        request.body.userId
      );

      if (article === false) {
        reply.code(403);

        return {
          statusCode: 403,
          error: 'Forbidden',
          message: 'not owner of article',
        };
      }

      if (article === null) {
        reply.code(404);

        return {
          statusCode: 404,
          error: 'Not Found',
          message: 'article not found',
        };
      }

      return {
        statusCode: 200,
        res: article,
      };
    }
  );
}

export default route;
