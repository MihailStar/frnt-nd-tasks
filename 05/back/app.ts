import fastify from 'fastify';
import authRoute from './routes/auth.route';
import articlesRoute from './routes/articles.route';

const app = fastify();

// TODO: add CORS
app.register(authRoute);
app.register(articlesRoute);

export default app;
