const Boom = require('@hapi/boom');

const models = require('../models');

exports.create = async ({ name, description, userId }) => models.$transaction(async (tx) => {
  const tag = await tx.tag.findUnique({ where: { name }, select: { id: true } });

  if (tag) {
    throw Boom.badRequest('tag name is exists');
  }

  return tx.tag.create({ data: { name, description, userId } });
});
