const models = require('../models');

module.exports = (role) => async (ctx, next) => {
  const { id: userId } = ctx.state.user;

  const user = await models.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user.role !== role) {
    ctx.throw(403, 'forbidden');
  }

  await next();
};
