const { assert } = require('chai');
const faker = require('faker');
const _ = require('lodash');

const proxy = require('../../proxy');
const init = require('../init');
const { assign } = require('../../utils');

describe('proxy posts', () => {
  const payload = init.posts.getData();

  before(async () => {
    const tag = await init.tags.create();

    _.extend(payload, {
      userId: tag.userId,
      tagId: tag.id,
    });

    await init.posts.createMany(assign({ n: 10 }, _.pick(payload, ['userId', 'tagId'])));
  });

  it('post create pass', async () => {
    const post = await proxy.posts.create(payload);

    assert.isNumber(post.id);
  });

  it('post create fail', async () => {
    const err = await proxy.posts.create(assign(
      payload,
      { tagId: faker.datatype.number() },
    ))
      .catch((err) => err);

    assert.isString(err.message);
    assert.equal(400, err.output.statusCode);
  });

  it('post list pass', async () => {
    const cond = { page: 3, size: 5 };

    const res = await proxy.posts.list(cond);

    assert.isTrue(res.list
      .every((d, i) => i === 0 || d?.updated <= res?.list[i - 1].updated)); // desc
  });
});
