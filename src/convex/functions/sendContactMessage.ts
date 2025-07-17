import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const sendContactMessage = mutation({
  args: {
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", args);
  },
});
export {}; // Add this line if there is no export at all
