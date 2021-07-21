import nodeFetch from 'node-fetch';
import FormData from 'form-data';
import Articles from './articles';

// @ts-ignore
global.fetch = nodeFetch;
// @ts-ignore
global.FormData = FormData;

const SECRET_KEY = '5682e1c2001e640de2e161a31ae2aaaf';
Articles.API_KEY = SECRET_KEY;

let response;
let createdId: string;

// NB: start back for testing
xdescribe('Create', () => {
  test('Articles.add({ title: "", text: "" }', async () => {
    response = await Articles.add({ title: '', text: '' });
    expect(response).toBe(false);
  });

  test('Articles.add({ title: "Title", text: "" })', async () => {
    response = await Articles.add({ title: 'Title', text: '' });
    expect(response).toBe(false);
  });

  test('Articles.add({ title: "", text: "Text" })', async () => {
    response = await Articles.add({ title: '', text: 'Text' });
    expect(response).toBe(false);
  });

  test('Articles.add({ title: "Title", text: "Text" })', async () => {
    response = await Articles.add({ title: 'Title', text: 'Text' });
    expect(typeof response).toBe('string');

    createdId = response as string;
  });
});

xdescribe('Read', () => {
  test('Articles.all()', async () => {
    response = await Articles.all();
    expect(Array.isArray(response)).toBe(true);
  });

  test('Articles.one("")', async () => {
    response = await Articles.one('');
    expect(response).toBe(null);
  });

  test('Articles.one(createdId)', async () => {
    response = await Articles.one(createdId);
    expect(response?.id).toBe(createdId);
  });
});

xdescribe('Update', () => {
  test('Articles.update(createdId, {})', async () => {
    response = await Articles.update(createdId, {});
    expect(response).toBe(false);
  });

  test('Articles.update(createdId, { title: "" })', async () => {
    response = await Articles.update(createdId, { title: '' });
    expect(response).toBe(false);
  });

  test('Articles.update(createdId, { title: "New title" })', async () => {
    response = await Articles.update(createdId, { title: 'New title' });
    expect(response).toBe(true);

    response = await Articles.one(createdId);
    expect(response?.title).toBe('New title');
    expect(response?.text).toBe('Text');
  });

  test('Articles.update(createdId, { text: "" })', async () => {
    response = await Articles.update(createdId, { text: '' });
    expect(response).toBe(false);
  });

  test('Articles.update(createdId, { text: "New text" })', async () => {
    response = await Articles.update(createdId, { text: 'New text' });
    expect(response).toBe(true);

    response = await Articles.one(createdId);
    expect(response?.title).toBe('New title');
    expect(response?.text).toBe('New text');
  });

  test('Articles.update("", { title: "Updated title", text: "Updated text" })', async () => {
    response = await Articles.update('', {
      title: 'Updated title',
      text: 'Updated text',
    });
    expect(response).toBe(null);
  });

  test('Articles.update(createdId, { title: "Updated title", text: "Updated text" })', async () => {
    response = await Articles.update(createdId, {
      title: 'Updated title',
      text: 'Updated text',
    });
    expect(response).toBe(true);

    response = await Articles.one(createdId);
    expect(response?.title).toBe('Updated title');
    expect(response?.text).toBe('Updated text');
  });
});

xdescribe('Delete', () => {
  test('Articles.remove("")', async () => {
    response = await Articles.remove('');
    expect(response).toBe(null);
  });

  test('Articles.remove(createdId)', async () => {
    response = await Articles.remove(createdId);
    expect(response).toBe(true);

    response = await Articles.one(createdId);
    expect(response).toBe(null);
  });
});
