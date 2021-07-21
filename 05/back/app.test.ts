/** @jest-environment node */

import supertest from 'supertest';
import app from './app';
import { Article } from './models/articles.model';
import { getData } from './utils/token';

const CREDENTIAL = 'mail@mail.mail';

const request = supertest(app.server);

let createdToken: string;

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Left request', () => {
  const url = '/js-6-api';

  test(`GET ${url}`, async () => {
    const response = await app.inject({ method: 'GET', url });

    expect(response.statusCode).toBe(404);
  });

  test(`GET ${url}`, async () => {
    const response = await request.get(url);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
  });
});

describe('Auth', () => {
  const url = '/js-6-api/auth.php';

  test(`POST ${url}`, async () => {
    const response = await request.post(url);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
  });

  test(`POST ${url} login`, async () => {
    const response = await request.post(url).field('login', CREDENTIAL);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
  });

  test(`POST ${url} password`, async () => {
    const response = await request.post(url).field('password', CREDENTIAL);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
  });

  test(`POST ${url} login password`, async () => {
    const response = await request
      .post(url)
      .field('login', 'INVALID')
      .field('password', 'INVALD');

    expect(response.status).toBe(403);
    expect(response.body.statusCode).toBe(403);
  });

  test(`POST ${url} login password`, async () => {
    const response = await request
      .post(url)
      .field('login', CREDENTIAL)
      .field('password', CREDENTIAL);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(typeof response.body.token).toBe('string');

    createdToken = response.body.token;
  });
});

describe('Articles', () => {
  const url = '/js-6-api/articles.php';
  let myArticle: Article;
  let notMyArticle: Article;

  test(`GET ${url}`, async () => {
    const response = await request.get(url);
    const { id: userId } = getData(createdToken);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(Array.isArray(response.body.res)).toBe(true);

    myArticle = response.body.res.find(
      (article: Article) => article.authorId === userId
    );
    notMyArticle = response.body.res.find(
      (article: Article) => article.authorId !== userId
    );
  });

  test(`GET ${url} id`, async () => {
    const response = await request.get(`${url}?id=INVALID`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
  });

  test(`GET ${url} id`, async () => {
    const response = await request.get(`${url}?id=${myArticle.id}`);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.res).toStrictEqual(myArticle);
  });

  test(`DELETE ${url}`, async () => {
    const response = await request.delete(url);

    expect(response.status).toBe(403);
    expect(response.body.statusCode).toBe(403);
  });

  test(`DELETE ${url} id`, async () => {
    const response = await request.delete(`${url}?id=${myArticle.id}`);

    expect(response.status).toBe(403);
    expect(response.body.statusCode).toBe(403);
  });

  test(`DELETE ${url} id token`, async () => {
    const response = await request
      .delete(`${url}?id=INVALID`)
      .set({ Authorization: createdToken });

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
  });

  test(`DELETE ${url} id token`, async () => {
    const response = await request
      .delete(`${url}?id=${myArticle.id}`)
      .set({ Authorization: createdToken });

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.res).toStrictEqual(myArticle);
  });

  test(`DELETE ${url} id token`, async () => {
    const response = await request
      .delete(`${url}?id=${myArticle.id}`)
      .set({ Authorization: createdToken });

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
  });

  test(`DELETE ${url} id token`, async () => {
    const response = await request
      .delete(`${url}?id=${notMyArticle.id}`)
      .set({ Authorization: createdToken });

    expect(response.status).toBe(403);
    expect(response.body.statusCode).toBe(403);
  });
});
