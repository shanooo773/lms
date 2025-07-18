import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Lesson Management
export const createLesson = mutation({
  args: {
    moduleId: v.id("modules"),
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("video"), v.literal("text"), v.literal("pdf")),
    order: v.number(),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lessons", {
      moduleId: args.moduleId,
      courseId: args.courseId,
      title: args.title,
      content: args.content,
      type: args.type,
      order: args.order,
      duration: args.duration,
      createdAt: Date.now(),
    });
  },
});

export const getLessonsByModule = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_module", q => q.eq("moduleId", args.moduleId))
      .order("asc")
      .collect();
  },
});

export const getLessonsByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();
  },
});

export const getLessonById = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

export const updateLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.union(v.literal("video"), v.literal("text"), v.literal("pdf"))),
    order: v.optional(v.number()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { lessonId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(lessonId, filteredUpdates);
  },
});

export const deleteLesson = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.lessonId);
  },
});