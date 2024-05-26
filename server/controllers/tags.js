const joi = require('joi');
const proxy = require('../proxy');

exports.create = async (ctx) => {
  const { name, description } = ctx.request.body;

  const { id: userId } = ctx.state.user;

  const schema = joi.object({
    name: joi.string().required().min(2).max(48),
    description: joi.string().required().max(256),
    userId: joi.number().integer().required(),
  });

  try {
    await schema.validateAsync({ name, description, userId });
  } catch (err) {
    ctx.throw(400, 'create tag input check fail');
  }

  const tag = await proxy.tags.create({ name, description, userId });

  ctx.status = 201;
  ctx.body = tag;
};

exports.update = async () => {

};

exports.list = async () => {

};

exports.destroy = async () => { // by admin

};
