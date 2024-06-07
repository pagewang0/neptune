const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient({
  log: [
    // { emit: 'event', level: 'query' },
    // { emit: 'stdout', level: 'info' },
    // { emit: 'stdout', level: 'warn' },
    // { emit: 'stdout', level: 'error' },
  ],
  datasourceUrl: config.db.url,
});

module.exports = prisma;

// prisma.$on('query', (e) => {
//   console.log(`Query: ${e.query}`);
//   console.log(`Params: ${e.params}`);
//   console.log(`Duration: ${e.duration}ms`);
// });
