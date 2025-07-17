// src/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
  name: v.string(),
  email: v.string(),
  role: v.string(),
  password: v.number(),
}),


  courses: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    videoUrl: v.string(),
    createdBy: v.string(),
  }),

  enrollments: defineTable({
    userId: v.string(),
    courseId: v.string(),
    enrolledAt: v.string(),
  }),

  progress: defineTable({
  userId: v.string(),
  courseId: v.string(),
  percentComplete: v.number(),
}).index("by_user_course", ["userId", "courseId"]),


  contactMessages: defineTable({
    email: v.string(),
    message: v.string(),
  }),
});
