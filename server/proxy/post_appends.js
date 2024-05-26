const Boom = require('@hapi/boom');
const Promise = require('bluebird');

const models = require('../models');

exports.create = async ({
  content,
  postId,
  userId,
  model = 'postAppend',
}) => models.$transaction(async (tx) => {
  const post = await tx.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    throw Boom.badRequest('post is not exists');
  }

  if (model === 'reply') {
    const reply = await tx[model].create({ data: { content, postId, userId } });

    await tx.post.update({
      where: { id: reply.postId },
      data: { lastReply: reply.id, updated: new Date() },
    });

    return reply;
  }

  return tx[model].create({ data: { content, postId, userId } });
});

exports.list = async ({
  page = 1, size = 20, model = 'postAppend', postId,
}) => {
  const where = {};

  if (postId) {
    where.postId = parseInt(postId, 10);
  }

  return Promise.props({
    list: models[model].findMany({
      where,
      skip: parseInt(page - 1, 10) * size,
      take: parseInt(size, 10),
      orderBy: [
        { id: 'asc' },
      ],
    }),
    count: models[model].count({ where }),
  });
};
