import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    instructorId: v.id("users"),
    thumbnailUrl: v.optional(v.string()),
    price: v.number(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("courses", {
      title: args.title,
      description: args.description,
      instructorId: args.instructorId,
      thumbnailUrl: args.thumbnailUrl,
      price: args.price,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});

export const getAllCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const getCourseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});

export const getCoursesByInstructor = query({
  args: { instructorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_instructor", q => q.eq("instructorId", args.instructorId))
      .collect();
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { courseId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(courseId, filteredUpdates);
  },
});
