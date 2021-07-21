import { FromSchema } from 'json-schema-to-ts';

import articleSchema from '../schemas/article.schema';

type Article = FromSchema<typeof articleSchema>;

const articles: Array<Article> = [
  {
    id: 'rmxNgpRs40zq6rp1KtR3C',
    title: 'Промисификация кода',
    dt: '2018-12-06',
    text:
      'Код без промисов бывает жестью, но и с ними можно изобразить много странного.',
    authorId: '75ug_iKxTm8Z661dPimPF',
  },
  {
    id: 'RkzctbrcntmGLB4oCpGJS',
    title: 'Промисификация кода',
    dt: '2018-12-06',
    text:
      'Код без промисов бывает жестью, но и с ними можно изобразить много странного.',
    authorId: 'K6QJsNHDxfTrKPFGutGNL',
  },
  {
    id: 'laSY7d0czoOeYZ9bNyYU4',
    title: 'Итераторы и генераторы',
    dt: '2018-12-01',
    text:
      'Сначала пугают всех, кто к ним прикасается, а Symbol кажется бредом.',
    authorId: '75ug_iKxTm8Z661dPimPF',
  },
  {
    id: 'm4eZnmCt7V_CqXDeKJ8kD',
    title: 'Итераторы и генераторы',
    dt: '2018-12-01',
    text:
      'Сначала пугают всех, кто к ним прикасается, а Symbol кажется бредом.',
    authorId: 'K6QJsNHDxfTrKPFGutGNL',
  },
  {
    id: '1e6-6AHTbZYv-BLXUbrKZ',
    title: 'Javascript',
    dt: '2018-12-02',
    text: 'Все равно хороший язык программирования.',
    authorId: '75ug_iKxTm8Z661dPimPF',
  },
  {
    id: 'SRFM4w1Zq7v33yflnrhaa',
    title: 'Javascript',
    dt: '2018-12-02',
    text: 'Все равно хороший язык программирования.',
    authorId: 'K6QJsNHDxfTrKPFGutGNL',
  },
];

const Articles = {
  async getAll(): Promise<Article[]> {
    return articles;
  },

  async getById(id: Article['id']): Promise<Article | null> {
    const article = articles.find((a) => a.id === id);

    return article === undefined ? null : { ...article };
  },

  async delById(
    id: Article['id'],
    userId?: Article['authorId']
  ): Promise<Article | null | false> {
    const articleIndex = articles.findIndex((a) => a.id === id);

    const hasArticle = articleIndex !== -1;
    if (!hasArticle) {
      return null;
    }

    const hasRight =
      userId === undefined || userId === articles[articleIndex].authorId;
    if (!hasRight) {
      return false;
    }

    return articles.splice(articleIndex, 1)[0];
  },
};

export default Articles;
export { Article };
