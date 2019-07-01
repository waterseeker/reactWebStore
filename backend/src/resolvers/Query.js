// if your query is exactly the same on your Prisma and your Yoga,
// you can just forward that query from Yoga to Prisma so you don't have to
// duplicate the code for the query by using 'forwardto'

const { forwardTo } = require("prisma-binding");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if theyre is a current user Id
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
};

module.exports = Query;
