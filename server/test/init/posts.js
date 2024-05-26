const faker = require('faker');

const tags = require('./tags');
const models = require('../../models');
const { assign } = require('../../utils');

exports.getData = () => ({
  title: faker.name.title(),
  content: faker.finance.transactionDescription(),
  tagId: null,
  userId: null,
});

exports.createBefore = async ({ userId, tagId }) => {
  if (!tagId) {
    const tag = await tags.create();

    return { userId: tag.userId, tagId: tag.id };
  }

  return { userId, tagId };
};

exports.create = async (opts = {}) => {
  const { userId, tagId } = await exports.createBefore(opts);

  return models.post.create({
    data: assign(exports.getData(), { userId, tagId }),
  });
};

exports.createMany = async (opts = {}) => {
  const { userId, tagId } = await exports.createBefore(opts);
  const { n } = opts;
  const bulks = [];

  for (let i = 0; i < n; i++) {
    bulks.push(assign(exports.getData(), { userId, tagId }));
  }

  return models.post.createMany({
    data: bulks,
  });
};
