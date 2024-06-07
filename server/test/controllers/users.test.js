const faker = require('faker');
const { assert } = require('chai');
const _ = require('lodash');

const config = require('../../config');
const utils = require('../../utils');
const common = require('../common');
const models = require('../../models');
const init = require('../init');
const { assign } = require('../../utils');

describe('controllers users', () => {
  const payload = init.users.getUser();
  const fields = ['name', 'email'];
  const { request } = common;

  it('register 201', async () => {
    const res = await request.post('/register', payload);

    assert(201, res.status);

    const user = await models.user.findUnique({ where: { name: payload.name } });

    assert.deepEqual(_.pick(user, fields), _.pick(user, fields));
  });

  it('register 400', async () => {
    const res = await request.post('/register', payload);

    assert.equal(400, res.status);
    assert.isString(res.data.error);
  });

  it('login 200', async () => {
    const res = await request.post('/login', _.pick(payload, ['email', 'password']));

    assert.equal(200, res.status);

    const [, token] = res.headers['set-cookie'][0].match(/token=([^;]+);/);

    const { id: userId } = await utils.jwt_verify(token, config.jwt.secret);

    await models.user.findFirstOrThrow({ where: { id: userId } });

    _.extend(payload, { userId, token });
  });

  it('login 401', async () => {
    const res = await request.post('/login', assign(_.pick(payload, 'email'), {
      password: faker.internet.password(),
    }));

    assert.equal(401, res.status);
    assert.isString(res.data.error);
  });

  it('me 200', async () => {
    const { token } = payload;
    const fields = ['email', 'name'];

    common.requestAddToken(() => token);

    const res = await request.get('/me');

    assert.equal(200, res.status);
    assert.deepEqual(_.pick(res.data, fields), _.pick(payload, fields));
  });

  it('user read 200', async () => {
    const res = await request.get('/user', { params: _.pick(payload, 'userId') });

    assert.equal(200, res.status);
    assert.deepEqual(_.pick(res.data, fields), _.pick(payload, fields));
  });
});
