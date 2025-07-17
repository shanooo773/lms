import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateProgress = mutation({
  args: {
    userId: v.string(),
    courseId: v.string(),
    percentComplete: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId)
      )
      .filter(q => q.eq("courseId", args.courseId))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        percentComplete: args.percentComplete,
      });
    } else {
      return await ctx.db.insert("progress", args);
    }
  },
});

export {};
