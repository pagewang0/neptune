const Boom = require('@hapi/boom');
const Promise = require('bluebird');

const models = require('../models');

exports.create = async ({
  title, content, tagId, userId,
}) => models.$transaction(async (tx) => {
  const tag = await tx.tag.findUnique({
    where: { id: tagId },
    select: { id: true },
  });

  if (!tag) {
    throw Boom.badRequest('tag is not exists');
  }

  return tx.post.create({
    data: {
      title, content, tagId, userId,
    },
  });
});

exports.list = async ({ page = 1, size = 20 }) => Promise.props({
  list: models.post.findMany({
    skip: parseInt(page - 1, 10) * size,
    take: parseInt(size, 10),
    include: {
      LastReply: true,
    },
    orderBy: [
      { updated: 'desc' },
    ],
  }),
  count: models.post.count(),
});

exports.search = async () => {

};
