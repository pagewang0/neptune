module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // console.log(err.stack);

    if (err.isBoom) {
      ctx.status = err.output.statusCode;
      ctx.body = { error: err.output.payload.message };
      return;
    }

    ctx.status = err.status || 500;

    if (err.status === 401) {
      ctx.body = { error: err.message || 'jwt is overdue' };

      return;
    }

    ctx.app.emit('error', err, ctx);

    ctx.body = {
      error: err.message || 'server error',
    };
  }
};
