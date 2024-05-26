const { assert } = require('chai');
const faker = require('faker');
const _ = require('lodash');

const proxy = require('../../proxy');
const models = require('../../models');
const init = require('../init');
const { assign } = require('../../utils');

describe('proxy users', () => {
  it('get token throw', async () => {
    const err = await proxy.users.get_token('', { notBefore: '' })
      .catch((err) => err);

    assert.equal(err.output.statusCode, 400);
  });

  const payload = init.users.getUser();

  it('register a user pass', async () => {
    const token = await proxy.users.register(payload);

    const user = await models.user.findUnique({ where: { email: payload.email } });

    const token2 = await proxy.users.get_token(user.id);

    assert.equal(token, token2);

    payload.userId = user.id;
  });

  it('register a user fail', async () => {
    const err = await proxy.users.register(payload)
      .catch((err) => err);

    assert.equal(400, err.output.statusCode);
    assert.isString(err.message);
  });

  it('login 401 email not exists', async () => {
    const err = await proxy.users.login({
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).catch((err) => err);

    assert.equal(401, err.output.statusCode);
  });

  it('login 401 password not correct', async () => {
    const err = await proxy.users.login(assign(payload, {
      password: faker.internet.password(),
    })).catch((err) => err);

    assert.equal(401, err.output.statusCode);
  });

  it('login pass', async () => {
    const token = await proxy.users.login(_.pick(payload, ['email', 'password']));

    const user = await models.user.findUnique({ where: { email: payload.email } });

    const token2 = await proxy.users.get_token(user.id);

    assert.equal(token, token2);
  });

  it('read a user', async () => {
    const fields = ['email', 'name'];
    const user = await proxy.users.read(payload.userId);

    assert.deepEqual(_.pick(user, fields), _.pick(payload, fields));
  });

  it('read user 404', async () => {
    const err = await proxy.users.read(faker.datatype.number())
      .catch((err) => err);

    assert.equal(404, err.output.statusCode);
  });
});
