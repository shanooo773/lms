import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const sendContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      name: args.name,
      email: args.email,
      message: args.message,
      createdAt: Date.now(),
      status: "new",
    });
  },
});

export const getAllContactMessages = query({
  handler: async (ctx) => {
    return await ctx.db.query("contactMessages").collect();
  },
});

export const updateContactMessageStatus = mutation({
  args: {
    messageId: v.id("contactMessages"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.messageId, {
      status: args.status,
    });
  },
});
