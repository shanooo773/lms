import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Module Management
export const createModule = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("modules", {
      courseId: args.courseId,
      title: args.title,
      description: args.description,
      order: args.order,
      createdAt: Date.now(),
    });
  },
});

export const getModulesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("modules")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();
  },
});

export const updateModule = mutation({
  args: {
    moduleId: v.id("modules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { moduleId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(moduleId, filteredUpdates);
  },
});

export const deleteModule = mutation({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.moduleId);
  },
});