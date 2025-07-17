import { mutation, MutationCtx } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { name: string; email: string; role: string }) => {
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      // password is optional in schema, so we can omit it
    });
  },
});
