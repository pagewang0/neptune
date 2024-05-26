const { PrismaClient } = require('@prisma/client');
const config = require('../config');

module.exports = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
  datasourceUrl: config.db.url,
});
