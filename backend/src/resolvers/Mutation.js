const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    async signup(parent, args, ctx, info) {
        // lowercase their password
        args.email = args.email.toLowerCase();
        // hash their password
        const password = await bcrypt.hash(args.password, 10);
        // create the user in the database
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: { set: ['USER'] },
                },
            },
            info
        );
        // create the JSON Web Token(jwt) for the user
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // set the jwt as a cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        // return the user to the browser
        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        // Check if there is a user with that email
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No account found for email ${email}`);
        }
        // Check if the password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid Password!');
        }
        // generate the JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // set the cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        // return the user
        return user;
    },
    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Goodbye!' };
    },
};

module.exports = Mutations;
