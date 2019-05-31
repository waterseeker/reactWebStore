// if your query is exactly the same on your Prisma and your Yoga,
// you can just forward that query from Yoga to Prisma so you don't have to
// duplicate the code for the query by using 'forwardto'

const { forwardTo } = require('prisma-binding');

const Query = {
    items: forwardTo('db'),
    // this code is replaced by the above use of forwardTo
    // async items(parent, args, ctx, info) {
    //     const items = await ctx.db.query.items();
    //     return items;
    // },
};

module.exports = Query;
