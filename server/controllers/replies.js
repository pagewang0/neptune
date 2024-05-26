const joi = require('joi');
const proxy = require('../proxy');

exports.create = async (ctx) => {
  const { content, postId } = ctx.request.body;
  const { id: userId } = ctx.state.user;

  const schema = joi.object({
    content: joi.string().required().max(102400),
    postId: joi.number().integer().required(),
    userId: joi.number().integer().required(),
  });

  try {
    await schema.validateAsync({
      content, postId, userId,
    });
  } catch (err) {
    ctx.throw(400, 'create post reply input check fail');
  }

  const append = await proxy.post_appends.create({
    content, postId, userId, model: 'reply',
  });

  ctx.status = 201;
  ctx.body = append;
};

exports.list = async (ctx) => {
  const { page, size, postId } = ctx.query;

  const schema = joi.object({
    page: joi.number().integer().min(1).required(),
    size: joi.number().integer().min(1).max(999)
      .required(),
    postId: joi.number().integer().required(),
  });

  try {
    await schema.validateAsync({
      page, size, postId,
    });
  } catch (err) {
    ctx.throw(400, 'post replies list input check fail');
  }

  ctx.body = await proxy.post_appends.list({
    page, size, postId, model: 'reply',
  });
};
