const faker = require('faker');

const posts = require('./posts');
const { assign } = require('../../utils');
const models = require('../../models');

exports.getData = () => ({
  content: faker.finance.transactionDescription(),
  postId: null,
  userId: null,
});

const createBefore = async ({ userId, postId }) => {
  if (!postId) {
    const post = await posts.create();

    return { userId: post.userId, postId: post.id };
  }

  return { userId, postId };
};

exports.createMany = async (opts) => {
  const { n, model = 'postAppend' } = opts;
  const bulks = [];
  const { userId, postId } = await createBefore(opts);

  for (let i = 0; i < n; i++) {
    bulks.push(assign(exports.getData(), { userId, postId }));
  }

  return models[model].createMany({
    data: bulks,
  });
};
