const { assert } = require('chai');
const _ = require('lodash');

const proxy = require('../../proxy');
const init = require('../init');

describe('proxy tags', () => {
  const payload = init.tags.getTag();

  before(async () => {
    const user = await init.users.create();

    _.extend(payload, { userId: user.id });
  });

  it('tag create pass', async () => {
    const tag = await proxy.tags.create(payload);

    assert.isNumber(tag.id);
  });

  it('tag create fail', async () => {
    const err = await proxy.tags.create(payload)
      .catch((err) => err);

    assert.equal(400, err.output.statusCode);
    assert.isString(err.message);
  });
});
