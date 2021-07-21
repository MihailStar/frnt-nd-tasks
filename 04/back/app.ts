import polka from 'polka';
import status from 'http-status';
import multer from 'multer';
import bodyParser from 'body-parser';
import { v4 as uuid } from 'uuid';

const ALLOWED_METHODS = ['OPTIONS', 'POST', 'GET', 'PUT', 'DELETE'];
const SECRET_KEY = '5682e1c2001e640de2e161a31ae2aaaf';

type ArticleDate = string;
type Article = { id: string; title: string; text: string; dt: ArticleDate };

const articles: Article[] = [
  {
    id: '0323605e-bfc0-4713-9cdf-d4757ee17528',
    title: 'Промисификация кода',
    dt: '2018-12-06',
    text:
      'Код без промисов бывает жестью, но и с ними можно изобразить много странного.',
  },
  {
    id: 'd34df6f5-5b21-4d77-a788-cadf6a03fe8d',
    title: 'Итераторы и генераторы',
    dt: '2018-12-01',
    text:
      'Сначала пугают всех, кто к ним прикасается, а Symbol кажется бредом.',
  },
  {
    id: '7e8e0c6d-8e52-4018-bcf1-93d6ea62670d',
    title: 'Javascript',
    dt: '2018-12-02',
    text: 'Все равно хороший язык программирования.',
  },
];

const mapArticles: Record<Article['id'], number> = {};
articles.forEach((article, index) => {
  mapArticles[article.id] = index;
});

const authorize: import('express').RequestHandler = (req, res, next) => {
  if (req.headers.authorization !== SECRET_KEY) {
    res.statusCode = status.FORBIDDEN;
    res.end(JSON.stringify({ messages: ['Not authorized'] }));
    return;
  }

  next();
};

const app = polka({
  onNoMatch: (req, res) => {
    if (ALLOWED_METHODS.some((allowedMethod) => allowedMethod === req.method)) {
      res.statusCode = status.NOT_FOUND;
      res.end(JSON.stringify({ messages: ['Page not found'] }));
      return;
    }

    res.setHeader('Allow', ALLOWED_METHODS.join(', '));
    res.statusCode = status.METHOD_NOT_ALLOWED;
    res.end(JSON.stringify({ messages: ['Method not allowed'] }));
  },
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8;');
  res.statusCode = status.OK;
  next();
});

app.options('/js-hw-api/articles.php', (req, res) => {
  res.setHeader('Allow', ALLOWED_METHODS.join(', '));
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.end();
});

// TODO: handle multer error 'LIMIT_UNEXPECTED_FILE'
app.post('/js-hw-api/articles.php', authorize, multer().none(), (req, res) => {
  if (req.body === undefined) req.body = {};

  const hasTitleField = typeof req.body.title === 'string';
  const hasContentField = typeof req.body.content === 'string';
  const messages: string[] = [];

  if (!hasTitleField) {
    messages.push('Title field not found');
  }

  if (!hasContentField) {
    messages.push('Content field not found');
  }

  if (hasTitleField && req.body.title.trim().length === 0) {
    messages.push('Title field is empty');
  }

  if (hasContentField && req.body.content.trim().length === 0) {
    messages.push('Content field is empty');
  }

  if (messages.length > 0) {
    res.statusCode = status.BAD_REQUEST;
    res.end(JSON.stringify({ messages }));
    return;
  }

  const date = new Date();
  const article: Article = {
    id: uuid(),
    title: req.body.title,
    text: req.body.content,
    dt: `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(
      2,
      '0'
    )}-${`${date.getUTCDate()}`.padStart(2, '0')}`,
  };
  articles.push(article);
  mapArticles[article.id] = articles.length - 1;

  res.end(JSON.stringify({ res: article }));
});

app.get('/js-hw-api/articles.php', (req, res) => {
  if (typeof req.query.id !== 'string') {
    res.end(JSON.stringify({ res: articles }));
    return;
  }

  if (mapArticles[req.query.id] === undefined) {
    res.statusCode = status.NOT_FOUND;
    res.end(JSON.stringify({ messages: ['Аrticle not found'] }));
    return;
  }

  res.end(JSON.stringify({ res: articles[mapArticles[req.query.id]] }));
});

app.put('/js-hw-api/articles.php', authorize, bodyParser.json(), (req, res) => {
  const hasIdField = typeof req.body.id === 'string';
  const hasTitleField = typeof req.body.title === 'string';
  const hasContentField = typeof req.body.content === 'string';
  const messages: string[] = [];

  if (!hasIdField) {
    messages.push('Id field not found');
  }

  if (!hasTitleField && !hasContentField) {
    messages.push('Title field not found');
    messages.push('Content field not found');
  }

  if (hasTitleField && req.body.title.trim().length === 0) {
    messages.push('Title field is empty');
  }

  if (hasContentField && req.body.content.trim().length === 0) {
    messages.push('Content field is empty');
  }

  if (messages.length > 0) {
    res.statusCode = status.BAD_REQUEST;
    res.end(JSON.stringify({ messages }));
    return;
  }

  if (mapArticles[req.body.id] === undefined) {
    res.statusCode = status.NOT_FOUND;
    res.end(JSON.stringify({ messages: ['Аrticle not found'] }));
    return;
  }

  if (hasTitleField) {
    articles[mapArticles[req.body.id]].title = req.body.title;
  }

  if (hasContentField) {
    articles[mapArticles[req.body.id]].text = req.body.content;
  }

  res.end(JSON.stringify({ res: articles[mapArticles[req.body.id]] }));
});

app.delete('/js-hw-api/articles.php', authorize, (req, res) => {
  if (typeof req.query.id !== 'string') {
    res.statusCode = status.BAD_REQUEST;
    res.end(JSON.stringify({ messages: ['Id query not found'] }));
    return;
  }

  if (mapArticles[req.query.id] === undefined) {
    res.statusCode = status.NOT_FOUND;
    res.end(JSON.stringify({ messages: ['Аrticle not found'] }));
    return;
  }

  const index = mapArticles[req.query.id];
  const article = articles[index];
  delete mapArticles[req.query.id];
  articles.splice(index, 1);

  res.end(JSON.stringify({ res: article }));
});

export default app;
