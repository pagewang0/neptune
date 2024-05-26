const Promise = require('bluebird');

const models = require('../models');
const common = require('./common');

after(async () => {
  await Promise.each([
    'reply',
    'postAppend',
    'post',
    'tag',
    'user',
  ], (name) => models[name].deleteMany({ where: {} }));

  await models.$disconnect();

  common.serverClose();
});
