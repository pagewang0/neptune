const joi = require('joi');
const proxy = require('../proxy');

exports.register = async (ctx) => {
  const { name, email, password } = ctx.request.body;

  const schema = joi.object({
    name: joi.string().required().max(48),
    password: joi.string().required().min(4).max(48),
    email: joi.string().email().required(),
  });

  try {
    await schema.validateAsync({ name, email, password });
  } catch (error) {
    ctx.throw(400, 'resgister input check fail');
  }

  const token = await proxy.users.register({ name, email, password });

  ctx.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 * 24,
  });

  ctx.status = 201;
  ctx.body = { token };
};

exports.login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(4).max(48),
  });

  try {
    await schema.validateAsync({ email, password });
  } catch (error) {
    ctx.throw(400, 'email or password is not correct');
  }

  const token = await proxy.users.login({ email, password });

  ctx.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 * 24,
  });

  ctx.body = { token };
};

exports.me = async (ctx) => {
  const { id: userId } = ctx.state.user;

  ctx.body = await proxy.users.read(userId);
};

exports.read = async (ctx) => {
  const { userId } = ctx.query;

  const schema = joi.object({
    userId: joi.number().integer().required(),
  });

  try {
    await schema.validateAsync({ userId });
  } catch (err) {
    ctx.throw(400, 'user read input check fail');
  }

  ctx.body = await proxy.users.read(parseInt(userId, 10));
};
