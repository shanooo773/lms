import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Comments & Discussions
export const createComment = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    lessonId: v.optional(v.id("lessons")),
    parentId: v.optional(v.id("comments")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      userId: args.userId,
      courseId: args.courseId,
      lessonId: args.lessonId,
      parentId: args.parentId,
      message: args.message,
      createdAt: Date.now(),
    });
  },
});

export const getCommentsByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .order("desc")
      .collect();
  },
});

export const getCommentsByLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_lesson", q => q.eq("lessonId", args.lessonId))
      .order("desc")
      .collect();
  },
});

export const getCommentReplies = query({
  args: { parentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_parent", q => q.eq("parentId", args.parentId))
      .order("asc")
      .collect();
  },
});

export const updateComment = mutation({
  args: {
    commentId: v.id("comments"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.commentId, {
      message: args.message,
    });
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.commentId);
  },
});