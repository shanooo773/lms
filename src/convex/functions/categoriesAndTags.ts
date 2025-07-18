import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Categories Management
export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      name: args.name,
      description: args.description,
      createdAt: Date.now(),
    });
  },
});

export const getAllCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Tags Management
export const createTag = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tags", {
      name: args.name,
      description: args.description,
      createdAt: Date.now(),
    });
  },
});

export const getAllTags = query({
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

// Course-Category Relationships
export const assignCourseToCategory = mutation({
  args: {
    courseId: v.id("courses"),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    // Check if relationship already exists
    const existing = await ctx.db
      .query("courseCategories")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .filter(q => q.eq(q.field("categoryId"), args.categoryId))
      .unique();

    if (existing) {
      return existing;
    }

    return await ctx.db.insert("courseCategories", {
      courseId: args.courseId,
      categoryId: args.categoryId,
    });
  },
});

export const getCoursesByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const courseCategories = await ctx.db
      .query("courseCategories")
      .withIndex("by_category", q => q.eq("categoryId", args.categoryId))
      .collect();

    const courses = await Promise.all(
      courseCategories.map(cc => ctx.db.get(cc.courseId))
    );

    return courses.filter(Boolean);
  },
});

// Course-Tag Relationships
export const assignCourseToTag = mutation({
  args: {
    courseId: v.id("courses"),
    tagId: v.id("tags"),
  },
  handler: async (ctx, args) => {
    // Check if relationship already exists
    const existing = await ctx.db
      .query("courseTags")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .filter(q => q.eq(q.field("tagId"), args.tagId))
      .unique();

    if (existing) {
      return existing;
    }

    return await ctx.db.insert("courseTags", {
      courseId: args.courseId,
      tagId: args.tagId,
    });
  },
});

export const getCoursesByTag = query({
  args: { tagId: v.id("tags") },
  handler: async (ctx, args) => {
    const courseTags = await ctx.db
      .query("courseTags")
      .withIndex("by_tag", q => q.eq("tagId", args.tagId))
      .collect();

    const courses = await Promise.all(
      courseTags.map(ct => ctx.db.get(ct.courseId))
    );

    return courses.filter(Boolean);
  },
});

export const getCourseTags = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const courseTags = await ctx.db
      .query("courseTags")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .collect();

    const tags = await Promise.all(
      courseTags.map(ct => ctx.db.get(ct.tagId))
    );

    return tags.filter(Boolean);
  },
});

export const getCourseCategories = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const courseCategories = await ctx.db
      .query("courseCategories")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .collect();

    const categories = await Promise.all(
      courseCategories.map(cc => ctx.db.get(cc.categoryId))
    );

    return categories.filter(Boolean);
  },
});