import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Enrollment Management
export const enrollUser = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    paymentStatus: v.union(v.literal("free"), v.literal("paid")),
  },
  handler: async (ctx, args) => {
    // Check if user is already enrolled
    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();

    if (existingEnrollment) {
      throw new Error("User is already enrolled in this course");
    }

    return await ctx.db.insert("enrollments", {
      userId: args.userId,
      courseId: args.courseId,
      enrolledAt: Date.now(),
      paymentStatus: args.paymentStatus,
    });
  },
});

export const getUserEnrollments = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .collect();
  },
});

export const getCourseEnrollments = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const checkEnrollment = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();
  },
});

export const updatePaymentStatus = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
    paymentStatus: v.union(v.literal("free"), v.literal("paid")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.enrollmentId, {
      paymentStatus: args.paymentStatus,
    });
  },
});

export const unenrollUser = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    return await ctx.db.delete(enrollment._id);
  },
});