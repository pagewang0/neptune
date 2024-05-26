module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // console.log(err);
    if (err.isBoom) {
      ctx.status = err.output.statusCode;
      ctx.body = { error: err.output.payload.message };
    } else {
      ctx.status = err.status || 500;

      if (err.status === 401) {
        ctx.body = { error: 'jwt is overdue' };
      } else {
        ctx.body = {
          error: err.message || 'server error',
        };
      }
    }

    ctx.app.emit('error', err, ctx);
  }
};
