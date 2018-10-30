const knex = require('../db');

const headers = {
  'WWW-Authenticate': 'Basic realm="Restricted Area", charset="UTF-8"',
};

module.exports = () => async (ctx, next) => {
  const { authorization } = ctx.headers;

  if (authorization === undefined) {
    return ctx.throw(401, undefined, { headers });
  }

  const [, base64] = authorization.split(' ');
  const [username, password] = Buffer.from(base64, 'base64').toString().split(':');

  const user = await knex('users')
    .where({ username, password })
    .first('*');

  if (user === undefined) {
    return ctx.throw(401, undefined, { headers });
  }

  ctx.state.user = user;

  return next();
};