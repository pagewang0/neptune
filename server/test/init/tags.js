const faker = require('faker');

const models = require('../../models');
const users = require('./users');
const { assign } = require('../../utils');

exports.getTag = () => ({
  name: faker.name.findName(),
  description: faker.finance.transactionDescription(),
  userId: null,
});

exports.create = async () => {
  const user = await users.create();

  return models.tag.create({
    data: assign(exports.getTag(), {
      userId: user.id,
    }),
  });
};
