import StatusCode, { Code } from './status-code';

const GLOBAL_PROBABILITY = 1;
const BAD_JSON_PROBABILITY = 0;

type ArticleDate = string;
type Article = { id: number; title: string; dt: ArticleDate; text: string };

const articlesStorage: Article[] = [
  {
    id: 1,
    title: 'Промисификация кода',
    dt: '2018-12-06',
    text:
      'Код без промисов бывает жестью, но и с ними можно изобразить много странного.',
  },
  {
    id: 2,
    title: 'Итераторы и генераторы',
    dt: '2018-12-01',
    text:
      'Сначала пугают всех, кто к ним прикасается, а Symbol кажется бредом.',
  },
  {
    id: 5,
    title: 'Javascript',
    dt: '2018-12-02',
    text: 'Все равно хороший язык программирования.',
  },
];

const mapArticles: Record<Article['id'], number> = {};
articlesStorage.forEach((article, index) => {
  mapArticles[article.id] = index;
});

function timeoutProbability(time: number, probability: number): Promise<void> {
  return new Promise((onSuccess, onError) => {
    setTimeout(() => {
      if (Math.random() < probability) {
        onSuccess();
      } else {
        onError();
      }
    }, time);
  });
}

type Answer = { data: unknown; code: Code; status: string };

function serverAnswer(
  data: Answer['data'],
  code: Answer['code'] = StatusCode.OK,
  status: Answer['status'] = 'OK'
): string {
  if (Math.random() < BAD_JSON_PROBABILITY) {
    return 'Incorrect JSON';
  }

  return JSON.stringify({ code, status, data });
}

const badServerAnswer = serverAnswer(
  '',
  StatusCode.PROBABILITY_ERROR,
  'Probability Error'
);

function getArticles(): Promise<string> {
  return timeoutProbability(300, GLOBAL_PROBABILITY)
    .then(() => serverAnswer(articlesStorage))
    .catch(() => badServerAnswer);
}

function getArticle(id: Article['id']): Promise<string> {
  return timeoutProbability(300, GLOBAL_PROBABILITY)
    .then(() => serverAnswer(articlesStorage[mapArticles[id]]))
    .catch(() => badServerAnswer);
}

function removeArticle(id: Article['id']): Promise<string> {
  return timeoutProbability(300, GLOBAL_PROBABILITY)
    .then(() => {
      if (id in mapArticles) {
        const num = mapArticles[id];

        delete mapArticles[id];
        articlesStorage.splice(num, 1);

        return serverAnswer(true);
      }

      return serverAnswer(false);
    })
    .catch(() => badServerAnswer);
}

export {
  Article,
  Answer,
  getArticles as all,
  getArticle as get,
  removeArticle as remove,
};
