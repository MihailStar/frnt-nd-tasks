import * as ArticlesModel from './articles';

ArticlesModel.all()
  .then((articles) => {
    const index = Math.floor(Math.random() * articles.length);
    const { id } = articles[index];

    console.log(`articles count = ${articles.length}`);
    console.log(`select index = ${index}, id = ${id}`);

    return ArticlesModel.one(id);
  })
  .then((article) => {
    console.log(article);

    return ArticlesModel.remove(article.id);
  })
  .then((isRemoved) => {
    console.log(`deleted? - ${isRemoved.toString()}`);

    return ArticlesModel.all();
  })
  .then((articles) => {
    console.log(`articles count = ${articles.length}`);
  })
  .catch((reason) => {
    console.error((reason instanceof Error && reason.message) ?? reason);
  });
