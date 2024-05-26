const faker = require('faker');

const models = require('../../models');
const proxy = require('../../proxy');

exports.getUser = () => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

exports.create = async () => {
  const payload = exports.getUser();

  await proxy.users.register(payload);

  return models.user.findUnique({ where: { email: payload.email } });
};
