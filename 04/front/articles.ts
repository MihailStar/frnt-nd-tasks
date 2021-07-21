type ArticleId = string;
type Article = { id: ArticleId; title: string; text: string; dt: string };
type ArticleArguments = { title: Article['title']; text: Article['text'] };

type ResponseWithArticle = { res: Article };
type ResponseWithError = { messages: string[] };

const isResponseWithArticle = (
  obj: ResponseWithArticle | ResponseWithError
): obj is ResponseWithArticle => 'res' in obj && obj.res instanceof Object;
const isResponseWithError = (
  obj: ResponseWithArticle | ResponseWithError
): obj is ResponseWithError => 'messages' in obj && Array.isArray(obj.messages);

class ArticleError extends Error {
  public constructor(
    public readonly status: number,
    public readonly messages: string[]
  ) {
    super(messages.join('. '));
  }
}

class Articles {
  public static readonly API_URL = 'http://localhost:80/js-hw-api/articles.php';
  public static API_KEY = '';

  public static async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Article> {
    if (options.headers === undefined) options.headers = {};
    Object.assign(options.headers, { Authorization: Articles.API_KEY });

    const response = await fetch(url, options);
    const data = await response.json();

    if (isResponseWithArticle(data)) return data.res;

    throw new ArticleError(
      response.status,
      (data as ResponseWithError).messages
    );
  }

  public static async all(): Promise<Article[]> {
    const articles = ((await Articles.makeRequest(
      Articles.API_URL
    )) as unknown) as Article[];

    return articles;
  }

  public static async one(id: ArticleId): Promise<Article | null> {
    try {
      const article = await Articles.makeRequest(
        `${Articles.API_URL}?id=${id}`,
        {
          method: 'GET',
        }
      );

      return article;
    } catch (error) {
      if (error instanceof ArticleError && error.status === 404) return null;

      throw error;
    }
  }

  public static async add(data: ArticleArguments): Promise<ArticleId | false> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.text);

      const article = await Articles.makeRequest(Articles.API_URL, {
        method: 'POST',
        body: formData,
      });

      return article.id;
    } catch (error) {
      if (error instanceof ArticleError && error.status === 400) return false;

      throw error;
    }
  }

  public static async update(
    id: ArticleId,
    data: Partial<ArticleArguments>
  ): Promise<boolean | null> {
    try {
      await Articles.makeRequest(Articles.API_URL, {
        method: 'PUT',
        body: JSON.stringify({ id, title: data.title, content: data.text }),
        headers: { 'Content-Type': 'application/json' },
      });

      return true;
    } catch (error) {
      if (error instanceof ArticleError && error.status === 400) return false;
      if (error instanceof ArticleError && error.status === 404) return null;

      throw error;
    }
  }

  public static async remove(id: ArticleId): Promise<boolean | null> {
    try {
      await Articles.makeRequest(`${Articles.API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      return true;
    } catch (error) {
      if (error instanceof ArticleError && error.status === 400) return false;
      if (error instanceof ArticleError && error.status === 404) return null;

      throw error;
    }
  }
}

export default Articles;
