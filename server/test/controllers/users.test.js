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

  before(async () => {
    await models.user.create({
      data: {
        name: 'page',
        email: 'test@test.com',
        password: 'dadada',
        salt: 'salt',
      },
    });
  });

  it.only('register 201', async () => {
    // const res = await request.post('/register', payload);
    const res = await request.post('/register', {
      name: 'test',
      email: 'test@test.com',
      password: 'dadada',
    });

    assert.equal(201, res.status);

    const { id: userId } = await utils.jwt_verify(res.data.token, config.jwt.secret);

    const user = await models.user.findUnique({ where: { id: userId } });

    assert.deepEqual(_.pick(user, fields), _.pick(user, fields));

    payload.userId = userId;
  });

  it('register 400', async () => {
    const res = await request.post('/register', payload);

    assert.equal(400, res.status);
    assert.isString(res.data.error);
  });

  it('login 200', async () => {
    const res = await request.post('/login', _.pick(payload, ['email', 'password']));

    assert.equal(200, res.status);
    assert.isString(res.data.token);

    payload.token = res.data.token;
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
