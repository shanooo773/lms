import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Certificate Management
export const generateCertificate = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    // Check if certificate already exists
    const existingCertificate = await ctx.db
      .query("certificates")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();

    if (existingCertificate) {
      return existingCertificate;
    }

    // Check if user has completed the course
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", q =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();

    if (!enrollments) {
      throw new Error("User is not enrolled in this course");
    }

    // Generate certificate number
    const certificateNumber = `CERT-${Date.now()}-${args.userId.slice(-6)}`;

    return await ctx.db.insert("certificates", {
      userId: args.userId,
      courseId: args.courseId,
      issuedAt: Date.now(),
      certificateNumber,
      downloadUrl: undefined, // Will be set when PDF is generated
    });
  },
});

export const getUserCertificates = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .collect();
  },
});

export const getCourseCertificates = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const updateCertificateDownloadUrl = mutation({
  args: {
    certificateId: v.id("certificates"),
    downloadUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.certificateId, {
      downloadUrl: args.downloadUrl,
    });
  },
});

export const getCertificateByNumber = query({
  args: { certificateNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .filter(q => q.eq(q.field("certificateNumber"), args.certificateNumber))
      .unique();
  },
});