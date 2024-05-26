const { assert } = require('chai');
const _ = require('lodash');
const faker = require('faker');

const common = require('../common');
const proxy = require('../../proxy');
const init = require('../init');
const { assign } = require('../../utils');

describe('controllers post appends', async () => {
  const { request } = common;
  const payload = init.postAppends.getData();

  before(async () => {
    const post = await init.posts.create();

    const token = await proxy.users.get_token(post.userId);
    const fields = ['userId', 'postId'];

    common.requestAddToken(() => token);

    _.extend(payload, {
      userId: post.userId,
      postId: post.id,
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

  it('create post append 201', async () => {
    const res = await request
      .post('/post_append', payload);

    assert.equal(201, res.status);
    assert.isNumber(res.data.id);
    assert.deepEqual(res.data.content, payload.content);
  });

  it('create post append 400', async () => {
    const res = await request
      .post('/post_append', assign(payload, { postId: faker.datatype.number() }));

    assert.equal(400, res.status);
    assert.isString(res.data.error);
  });

  it('create post reply 201', async () => {
    const res = await request
      .post('/reply', payload);

    assert.equal(201, res.status);
    assert.isNumber(res.data.id);
    assert.deepEqual(res.data.content, payload.content);
  });

  it('post appends list 200', async () => {
    const params = { page: 1, size: 5 };
    const res = await request
      .get('/post_appends', {
        params: assign(_.pick(payload, 'postId'), params),
      });

    assert.isTrue(res.data.list
      .every((d, i) => i === 0 || d?.created >= res.data?.list[i - 1].created)); // asc
  });

  it('post replies list 200', async () => {
    const params = { page: 1, size: 5 };
    const res = await request
      .get('/replies', {
        params: assign(_.pick(payload, 'postId'), params),
      });

    assert.isTrue(res.data.list
      .every((d, i) => i === 0 || d?.created >= res.data?.list[i - 1].created)); // asc
  });
});
