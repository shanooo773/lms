import { mutation, MutationCtx } from "../_generated/server";
import { v } from "convex/values";

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    videoUrl: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { title: string; description: string; price: number; videoUrl: string; createdBy: string }) => {
    return await ctx.db.insert("courses", {
      title: args.title,
      description: args.description,
      price: args.price,
      videoUrl: args.videoUrl,
      createdBy: args.createdBy
    });
  },
});
