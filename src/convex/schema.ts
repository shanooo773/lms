// src/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User Management
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("student"), v.literal("instructor"), v.literal("admin")),
    createdAt: v.optional(v.number()),
    password: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Course Management
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    instructorId: v.id("users"),
    thumbnailUrl: v.optional(v.string()),
    price: v.number(),
    category: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_instructor", ["instructorId"]),

  // Course modules (sub-sections)
  modules: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_course", ["courseId"]),

  // Lessons within modules
  lessons: defineTable({
    moduleId: v.id("modules"),
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(), // video URL, text content, or file path
    type: v.union(v.literal("video"), v.literal("text"), v.literal("pdf")),
    order: v.number(),
    duration: v.optional(v.number()), // in minutes
    createdAt: v.number(),
  }).index("by_module", ["moduleId"]).index("by_course", ["courseId"]),

  // Enrollment & Payment
  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    enrolledAt: v.number(),
    paymentStatus: v.union(v.literal("free"), v.literal("paid")),
  }).index("by_user", ["userId"]).index("by_course", ["courseId"]).index("by_user_course", ["userId", "courseId"]),

  // Progress tracking
  progress: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    lessonId: v.optional(v.id("lessons")),
    completed: v.boolean(),
    watchedDuration: v.optional(v.number()), // in seconds
    lastAccessedAt: v.number(),
  }).index("by_user_course", ["userId", "courseId"]).index("by_user_lesson", ["userId", "lessonId"]),

  // Quiz system
  quizzes: defineTable({
    courseId: v.optional(v.id("courses")),
    moduleId: v.optional(v.id("modules")),
    title: v.string(),
    description: v.optional(v.string()),
    questions: v.array(v.object({
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.number(), // index of correct answer
      points: v.optional(v.number()),
    })),
    timeLimit: v.optional(v.number()), // in minutes
    createdAt: v.number(),
  }).index("by_course", ["courseId"]).index("by_module", ["moduleId"]),

  // Quiz attempts
  quizAttempts: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    answers: v.array(v.number()), // user's selected answer indices
    score: v.number(),
    maxScore: v.number(),
    completedAt: v.number(),
    timeSpent: v.optional(v.number()), // in seconds
  }).index("by_user", ["userId"]).index("by_quiz", ["quizId"]).index("by_user_quiz", ["userId", "quizId"]),

  // Comments & Discussions
  comments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    lessonId: v.optional(v.id("lessons")),
    parentId: v.optional(v.id("comments")), // for nested replies
    message: v.string(),
    createdAt: v.number(),
  }).index("by_course", ["courseId"]).index("by_lesson", ["lessonId"]).index("by_parent", ["parentId"]),

  // Certificate Generation
  certificates: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    issuedAt: v.number(),
    downloadUrl: v.optional(v.string()),
    certificateNumber: v.string(),
  }).index("by_user", ["userId"]).index("by_course", ["courseId"]).index("by_user_course", ["userId", "courseId"]),

  // Contact Form
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
    status: v.optional(v.union(v.literal("new"), v.literal("read"), v.literal("replied"))),
  }),

  // Categories & Tags
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }),

  tags: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // Course-Tag relationships
  courseTags: defineTable({
    courseId: v.id("courses"),
    tagId: v.id("tags"),
  }).index("by_course", ["courseId"]).index("by_tag", ["tagId"]),

  // Course-Category relationships
  courseCategories: defineTable({
    courseId: v.id("courses"),
    categoryId: v.id("categories"),
  }).index("by_course", ["courseId"]).index("by_category", ["categoryId"]),
});
