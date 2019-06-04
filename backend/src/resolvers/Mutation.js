const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO: Check if they're logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },
    updateItem(parent, args, ctx, info) {
        // first take a compy of the updates
        const updates = { ...args };
        // remove the ID from the updates because we don't want to update the ID
        delete updates.id;
        // call the update method
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id,
                },
            },
            info
        )
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // 1. find the item
        const item = await ctx.db.query.item({ where }, `{ id title}`);
        // 2. check if they own the item, or have correct permissions to delete it
        //TODO
        // 3. Delete the item.
        return ctx.db.mutation.deleteItem({ where }, info);
    },
};

module.exports = Mutations;
