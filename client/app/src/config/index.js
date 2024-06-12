import _ from 'lodash';
import base from './base';
import development from './development.js';
import production from './production.js';

const configs = {
  base,
  development,
  production,
};

const env = process.env.NODE_ENV;

export default _.merge(base, configs[env]);