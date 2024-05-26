const joi = require('joi');
const proxy = require('../proxy');

exports.create = async (ctx) => {
  const { title, content, tagId } = ctx.request.body;
  const { id: userId } = ctx.state.user;

  const schema = joi.object({
    title: joi.string().required().max(1024),
    content: joi.string().required().max(102400),
    tagId: joi.number().integer().required(),
    userId: joi.number().integer().required(),
  });

  try {
    await schema.validateAsync({
      title, content, tagId, userId,
    });
  } catch (err) {
    ctx.throw(400, 'create post input check fail');
  }

  const post = await proxy.posts.create({
    title, content, tagId, userId,
  });

  ctx.status = 201;
  ctx.body = post;
};

exports.list = async (ctx) => {
  const { page, size } = ctx.query;

  const schema = joi.object({
    page: joi.number().integer().min(1).required(),
    size: joi.number().integer().min(1).max(999)
      .required(),
  });

  try {
    await schema.validateAsync({
      page, size,
    });
  } catch (err) {
    ctx.throw(400, 'post list input check fail');
  }

  ctx.body = await proxy.posts.list({ page, size });
};

exports.destroy = async () => { // by admin

};
