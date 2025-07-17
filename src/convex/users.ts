// convex/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(), // ✅ If you are using roles
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        role: args.role,
        password: 0
    });
    return user;
  },
});
