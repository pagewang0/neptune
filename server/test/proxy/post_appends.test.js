const { assert } = require('chai');
const faker = require('faker');
const _ = require('lodash');

const proxy = require('../../proxy');
const init = require('../init');
const { assign } = require('../../utils');
const models = require('../../models');

describe('proxy post appends', () => {
  const payload = init.postAppends.getData();

  before(async () => {
    const post = await init.posts.create();
    const fields = ['userId', 'postId'];

    _.extend(payload, {
      postId: post.id,
      userId: post.userId,
    });

    await Promise.all([
      init.postAppends.createMany(assign(
        { n: 10 },
        _.pick(payload, fields),
      )),
      init.postAppends.createMany(assign(
        {
          n: 10,
          model: 'reply',
        },
        _.pick(payload, fields),
      )),
    ]);
  });

  it('post appends pass', async () => {
    const postAppend = await proxy.post_appends.create(payload);

    assert.isNumber(postAppend.id);
    assert.deepEqual(postAppend.content, payload.content);
  });

  it('post appends fail', async () => {
    const err = await proxy.post_appends.create(assign(
      payload,
      { postId: faker.datatype.number() },
    ))
      .catch((err) => err);

    assert.isString(err.message);
    assert.equal(400, err.output.statusCode);
  });

  it('post replies pass', async () => {
    const reply = await proxy.post_appends.create(assign(payload, { model: 'reply' }));

    assert.isNumber(reply.id);
    assert.deepEqual(reply.content, payload.content);

    const post = await models.post.findUnique({ where: { id: reply.postId } });

    assert.isNumber(post.lastReply);
  });

  it('post appends list pass', async () => {
    const cond = { page: 3, size: 5, postId: payload.postId };

    const res = await proxy.post_appends.list(cond);

    assert.equal((res.count - ((cond.page - 1) * cond.size)), res.list.length);
    assert.isTrue(res.list
      .every((d, i) => i === 0 || d?.created >= res?.list[i - 1].created)); // asc
  });

  it('post replies list pass', async () => {
    const cond = {
      page: 3, size: 5, model: 'reply', postId: payload.postId,
    };

    const res = await proxy.post_appends.list(cond);

    assert.equal((res.count - ((cond.page - 1) * cond.size)), res.list.length);
    assert.isTrue(res.list
      .every((d, i) => i === 0 || d?.created >= res?.list[i - 1].created)); // asc
  });
});
