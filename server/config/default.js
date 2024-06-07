module.exports = {
  jwt: {
    secret: 'local-secret',
    expire: 3600 * 24,
    unless: [
      '/register',
      '/login',
    ],
  },
  cookie: {
    key: 'token',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 * 24,
    },
  },
  db: {
    url: 'file:./dev.db',
  },
};
