module.exports = {
  jwt: {
    secret: 'local-secret',
    expire: 3600 * 24,
    unless: [
      '/register',
      '/login',
    ],
  },
  db: {
    url: 'file:./dev.db',
  },
};
