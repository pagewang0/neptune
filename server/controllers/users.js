const proxy = require('../proxy');
const config = require('../config');
const { joi } = require('../../common');

exports.register = async (ctx) => {
  const { name, email, password } = ctx.request.body;

  const schema = joi.register();
  try {
    await schema.validateAsync({ name, email, password });
  } catch (error) {
    ctx.throw(400, 'resgister input check fail');
  }

  await proxy.users.register({ name, email, password });

  ctx.status = 201;
};

exports.login = async (ctx) => {
  const { email, password } = ctx.request.body;

  const schema = joi.login();

  try {
    await schema.validateAsync({ email, password });
  } catch (error) {
    ctx.throw(401, 'email or password is not correct');
  }

  const token = await proxy.users.login({ email, password });

  ctx.cookies.set(config.cookie.key, token, config.cookie.options);

  ctx.status = 200;
};

exports.me = async (ctx) => {
  const { id: userId } = ctx.state.user;

  ctx.body = await proxy.users.read(userId);
};

exports.read = async (ctx) => {
  const { userId } = ctx.query;

  const schema = joi.userId();

  try {
    await schema.validateAsync({ userId });
  } catch (err) {
    ctx.throw(400, 'user read input check fail');
  }

  ctx.body = await proxy.users.read(parseInt(userId, 10));
};
