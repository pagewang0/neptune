const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Promise = require('bluebird');
const _ = require('lodash');

exports.jwt_sign = Promise.promisify(jwt.sign);
exports.jwt_verify = Promise.promisify(jwt.verify);
exports.assign = (a, ...b) => _.assign({}, a, ...b);

exports.exclude = (d, keys) => Object.fromEntries(
  Object.entries(d).filter(([key]) => !keys.includes(key)),
);

exports.md5 = (str, salt) => crypto.createHash('md5').update(`${salt}${str}`).digest('hex');
