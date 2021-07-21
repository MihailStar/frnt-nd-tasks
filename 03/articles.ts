import * as serverApi from './db';
import StatusCode from './status-code';

function handleResponse<Type>(method: string, response: string): Type {
  let answer: serverApi.Answer;

  try {
    answer = JSON.parse(response) as serverApi.Answer;
  } catch (error) {
    throw new Error(`'Incorrect JSON' in '${method}' method`);
  }

  if (answer.code !== StatusCode.OK) {
    throw new Error(`'${answer.status}' in '${method}' method`);
  }

  return answer.data as Type;
}

function all(): Promise<serverApi.Article[]> {
  return serverApi.all().then((response) => handleResponse('all', response));
}

function one(id: serverApi.Article['id']): Promise<serverApi.Article> {
  return serverApi.get(id).then((response) => handleResponse('one', response));
}

function remove(id: serverApi.Article['id']): Promise<boolean> {
  return serverApi
    .remove(id)
    .then((response) => handleResponse('remove', response));
}

export { all, one, remove };
