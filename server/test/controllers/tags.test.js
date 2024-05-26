const { assert } = require('chai');
const _ = require('lodash');

const common = require('../common');
const proxy = require('../../proxy');
const models = require('../../models');
const init = require('../init');
const { assign } = require('../../utils');

describe('controllers tags', () => {
  const payload = init.tags.getTag();
  const fields = ['name', 'description', 'userId'];

  const { request } = common;

  before(async () => {
    const user = await init.users.create();

    await models.user.update({ where: { id: user.id }, data: { role: 1 } });

    const token = await proxy.users.get_token(user.id);

    common.requestAddToken(() => token);

    _.extend(payload, {
      userId: user.id,
      token,
    });
  });

  it('create tag 201', async () => {
    const res = await request
      .post('/tag', _.pick(payload, fields));

    assert.equal(201, res.status);
    assert.deepEqual(
      _.pick(res.data, fields),
      assign(_.pick(payload, fields), { userId: payload.userId }),
    );
  });

  it('create tag 400', async () => {
    const res = await request
      .post('/tag', _.pick(payload, fields));

    assert.equal(400, res.status);
    assert.isString(res.data.error);
  });
});
