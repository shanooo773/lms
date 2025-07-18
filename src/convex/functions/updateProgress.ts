import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const updateProgress = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    lessonId: v.optional(v.id("lessons")),
    completed: v.boolean(),
    watchedDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find existing progress record
    let existing;
    if (args.lessonId) {
      existing = await ctx.db
        .query("progress")
        .withIndex("by_user_lesson", q =>
          q.eq("userId", args.userId).eq("lessonId", args.lessonId)
        )
        .unique();
    } else {
      existing = await ctx.db
        .query("progress")
        .withIndex("by_user_course", q =>
          q.eq("userId", args.userId).eq("courseId", args.courseId)
        )
        .filter(q => q.eq(q.field("lessonId"), undefined))
        .unique();
    }

    if (existing) {
      return await ctx.db.patch(existing._id, {
        completed: args.completed,
        watchedDuration: args.watchedDuration,
        lastAccessedAt: Date.now(),
      });
    } else {
      return await ctx.db.insert("progress", {
        userId: args.userId,
        courseId: args.courseId,
        lessonId: args.lessonId,
        completed: args.completed,
        watchedDuration: args.watchedDuration,
        lastAccessedAt: Date.now(),
      });
    }
  },
});

export const getProgressByUserCourse = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .collect();
  },
});

export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_user_course", q => q.eq("userId", args.userId))
      .collect();
  },
});
