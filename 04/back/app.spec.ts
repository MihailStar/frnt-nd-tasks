/** @jest-environment node */

import supertest from 'supertest';
import status from 'http-status';
import { v4 as uuid } from 'uuid';
import app from './app';

const SECRET_KEY = '5682e1c2001e640de2e161a31ae2aaaf';

const request = supertest(app.handler);

let response;
let createdId: string;

describe('Left request', () => {
  test('PATCH /js-hw-api', async () => {
    response = await request.patch('/js-hw-api');
    expect(response.headers.allow).toBeDefined();
    expect(response.status).toBe(status.METHOD_NOT_ALLOWED);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Method not allowed']);
  });

  test('GET /js-hw-api', async () => {
    response = await request.get('/js-hw-api');
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Page not found']);
  });
});

describe('CORS', () => {
  test('OPTIONS /js-hw-api/articles.php', async () => {
    response = await request.options('/js-hw-api/articles.php');
    expect(response.headers['allow']).toBeDefined();
    expect(response.headers['access-control-allow-origin']).toBeDefined();
    expect(response.headers['access-control-allow-methods']).toBeDefined();
    expect(response.headers['access-control-allow-headers']).toBeDefined();
    expect(response.status).toBe(status.OK);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Create', () => {
  test('POST /js-hw-api/articles.php', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php title=""', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('title', '');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php title="Title"', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('title', 'Title');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php content=""', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('content', '');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php content="Content"', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('content', 'Content');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php title=""&content=""', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('title', '')
      .field('content', '');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php title="Title"&content=""', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('title', 'Title')
      .field('content', '');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php title=""&content="Content"', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('title', '')
      .field('content', 'Content');
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
  });

  test('POST /js-hw-api/articles.php title="Title"&content="Content" without auth', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .field('title', 'Title')
      .field('content', 'Content');
    expect(response.status).toBe(status.FORBIDDEN);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Not authorized']);
  });

  test('POST /js-hw-api/articles.php title="Title"&content="Content"', async () => {
    response = await request
      .post('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .field('title', 'Title')
      .field('content', 'Content');
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBeDefined();
    expect(response.body.res.title).toBe('Title');
    expect(response.body.res.text).toBe('Content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();

    createdId = response.body.res.id;
  });
});

describe('Read after Create', () => {
  test('GET /js-hw-api/articles.php?id=createdId', async () => {
    response = await request.get(`/js-hw-api/articles.php?id=${createdId}`);
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Title');
    expect(response.body.res.text).toBe('Content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Read', () => {
  test('GET /js-hw-api/articles.php', async () => {
    response = await request.get('/js-hw-api/articles.php');
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(Array.isArray(response.body.res)).toBe(true);
    expect(response.body.messages).not.toBeDefined();
  });

  test('GET /js-hw-api/articles.php?id=""', async () => {
    response = await request.get('/js-hw-api/articles.php?id=""');
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Аrticle not found']);
  });

  test('GET /js-hw-api/articles.php?id=uuid', async () => {
    response = await request.get(`/js-hw-api/articles.php?id=${uuid()}`);
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Аrticle not found']);
  });

  test('GET /js-hw-api/articles.php?id=createdId', async () => {
    response = await request.get(`/js-hw-api/articles.php?id=${createdId}`);
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Title');
    expect(response.body.res.text).toBe('Content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Read after Read', () => {
  test('GET /js-hw-api/articles.php?id=createdId', async () => {
    response = await request.get(`/js-hw-api/articles.php?id=${createdId}`);
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Title');
    expect(response.body.res.text).toBe('Content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Update', () => {
  test('PUT /js-hw-api/articles.php', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {title:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ title: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {title:"Updated title"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ title: 'Updated title' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {content:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ content: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {content:"Updated content"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ content: 'Updated content' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {title:"",content:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ title: '', content: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {title:"",content:"Updated content"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ title: '', content: 'Updated content' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {title:"Updated title",content:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ title: 'Updated title', content: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {title:"Updated title",content:"Updated content"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ title: 'Updated title', content: 'Updated content' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:"",title:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: '', title: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:"",title:"Updated title"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: '', title: 'Updated title' });
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:uuid}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: uuid() });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:uuid,title:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: uuid(), title: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:uuid,title:"Updated title"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: uuid(), title: 'Updated title' });
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:createdId}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: createdId });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:createdId,title:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: createdId, title: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).not.toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:createdId,title:"Updated title"} without auth', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .send({ id: createdId, title: 'Updated title' });
    expect(response.status).toBe(status.FORBIDDEN);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Not authorized']);
  });

  test('PUT /js-hw-api/articles.php {id:createdId,title:"Updated title"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: createdId, title: 'Updated title' });
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Updated title');
    expect(response.body.res.text).toBe('Content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });

  test('PUT /js-hw-api/articles.php {id:createdId,content:""}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: createdId, content: '' });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).not.toContain('Id field not found');
    expect(response.body.messages).not.toContain('Title field not found');
    expect(response.body.messages).not.toContain('Title field is empty');
    expect(response.body.messages).not.toContain('Content field not found');
    expect(response.body.messages).toContain('Content field is empty');
    expect(response.body.messages).not.toContain('Аrticle not found');
  });

  test('PUT /js-hw-api/articles.php {id:createdId,content:"Updated content"} without authorization', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .send({ id: createdId, content: 'Updated content' });
    expect(response.status).toBe(status.FORBIDDEN);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Not authorized']);
  });

  test('PUT /js-hw-api/articles.php {id:createdId,content:"Updated content"}', async () => {
    response = await request
      .put('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY })
      .send({ id: createdId, content: 'Updated content' });
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Updated title');
    expect(response.body.res.text).toBe('Updated content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Read after Update', () => {
  test('GET /js-hw-api/articles.php?id=createdId', async () => {
    response = await request.get(`/js-hw-api/articles.php?id=${createdId}`);
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Updated title');
    expect(response.body.res.text).toBe('Updated content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Delete', () => {
  test('DELETE /js-hw-api/articles.php', async () => {
    response = await request
      .delete('/js-hw-api/articles.php')
      .set({ Authorization: SECRET_KEY });
    expect(response.status).toBe(status.BAD_REQUEST);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Id query not found']);
  });

  test('DELETE /js-hw-api/articles.php?id=""', async () => {
    response = await request
      .delete('/js-hw-api/articles.php?id=""')
      .set({ Authorization: SECRET_KEY });
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Аrticle not found']);
  });

  test('DELETE /js-hw-api/articles.php?id=uuid', async () => {
    response = await request
      .delete(`/js-hw-api/articles.php?id=${uuid()}`)
      .set({ Authorization: SECRET_KEY });
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Аrticle not found']);
  });

  test('DELETE /js-hw-api/articles.php?id=createdId without auth', async () => {
    response = await request.delete(`/js-hw-api/articles.php?id=${createdId}`);
    expect(response.status).toBe(status.FORBIDDEN);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Not authorized']);
  });

  test('DELETE /js-hw-api/articles.php?id=createdId', async () => {
    response = await request
      .delete(`/js-hw-api/articles.php?id=${createdId}`)
      .set({ Authorization: SECRET_KEY });
    expect(response.status).toBe(status.OK);
    expect(response.body.res).toBeDefined();
    expect(response.body.res.id).toBe(createdId);
    expect(response.body.res.title).toBe('Updated title');
    expect(response.body.res.text).toBe('Updated content');
    expect(response.body.res.dt).toBe(new Date().toISOString().slice(0, 10));
    expect(response.body.messages).not.toBeDefined();
  });
});

describe('Read after Delete', () => {
  test('GET /js-hw-api/articles.php?id=createdId', async () => {
    response = await request.get(`/js-hw-api/articles.php?id=${createdId}`);
    expect(response.status).toBe(status.NOT_FOUND);
    expect(response.body.res).not.toBeDefined();
    expect(response.body.messages).toStrictEqual(['Аrticle not found']);
  });
});
