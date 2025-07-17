// File: convex/users.ts or convex/functions/createUser.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(),
    password: v.string(), // ✅ expects a string
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      password: args.password
    });
  },
});
