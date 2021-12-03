import { Context } from './context'

export const resolvers = {
  Query: {
    users: async (parent, args, ctx: Context) => {
      return await ctx.db.user.findMany()
    },
  },
}
