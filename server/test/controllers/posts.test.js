const { assert } = require('chai');
const faker = require('faker');
const _ = require('lodash');

const common = require('../common');
const proxy = require('../../proxy');
const init = require('../init');
const { assign } = require('../../utils');

describe('controllers posts', () => {
  const payload = init.posts.getData();
  const fields = ['title', 'content', 'userId', 'tagId'];
  const { request } = common;

  before(async () => {
    const tag = await init.tags.create();

    const token = await proxy.users.get_token(tag.userId);

    common.requestAddToken(() => token);

    _.extend(payload, {
      userId: tag.userId,
      tagId: tag.id,
    });

    await init.posts.createMany(assign({ n: 10 }, _.pick(payload, ['userId', 'tagId'])));
  });

  it('create post 201', async () => {
    const res = await request
      .post('/post', payload);

    assert.equal(201, res.status);
    assert.isNumber(res.data.id);
    assert.deepEqual(_.pick(res.data, fields), _.pick(payload, fields));
  });

  it('create post 400', async () => {
    const res = await request
      .post('/post', assign(payload, {
        tagId: faker.datatype.number(),
      }));

    assert.equal(400, res.status);
    assert.isString(res.data.error);
  });

  it('post list 200', async () => {
    const params = { page: 1, size: 5 };
    const res = await request
      .get('/posts', { params });

    assert.isTrue(res.data.list
      .every((d, i) => i === 0 || d?.updated <= res.data?.list[i - 1].updated)); // desc
  });
});
