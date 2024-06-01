const Boom = require('@hapi/boom');
// const Promise = require('bluebird');

const utils = require('../utils');
const config = require('../config');
const models = require('../models');

exports.get_token = async (id, expire) => {
  let token;

  try {
    token = await utils.jwt_sign(
      { id },
      config.jwt.secret,
      expire,
    );
  } catch (error) {
    throw Boom.badRequest('jwt sign fail');
  }

  return token;
};

exports.register = async ({ name, email, password }) => {
  const newUser = await models.$transaction(async (tx) => {
    const res = await Promise.all([
      tx.user.findUnique({ where: { name } }),
      // tx.$queryRaw`SELECT id FROM User where name=${name}`.then((d) => !d[0] && null),
      tx.user.findUnique({ where: { email } }),
    ]);
    console.log(res);
    if (res.some((d) => d)) {
      throw Boom.badRequest('username or email exists');
    }

    const salt = Math.floor(Math.random() * 9999).toString(16);
    const encode = utils.md5(password, salt);

    return tx.user.create({
      data: {
        name,
        email,
        password: encode,
        salt,
      },
    });
  });

  return exports.get_token(newUser.id);
};

exports.login = async ({ email, password }) => {
  const user = await models.user.findUnique({
    where: { email },
    select: { password: true, salt: true, id: true },
  });

  const message401 = 'email or password is not correct';

  if (!user) {
    throw Boom.unauthorized(message401);
  }

  const encode = utils.md5(password, user.salt);

  if (encode !== user.password) {
    throw Boom.unauthorized(message401);
  }

  return exports.get_token(user.id);
};

exports.read = async (userId) => {
  const user = await models
    .user.findUnique({ where: { id: userId } });

  if (!user) {
    throw Boom.notFound('user is not exists');
  }

  return utils.exclude(user, ['password', 'salt']);
};
