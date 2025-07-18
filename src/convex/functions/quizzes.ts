import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Quiz Management
export const createQuiz = mutation({
  args: {
    courseId: v.optional(v.id("courses")),
    moduleId: v.optional(v.id("modules")),
    title: v.string(),
    description: v.optional(v.string()),
    questions: v.array(v.object({
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.number(),
      points: v.optional(v.number()),
    })),
    timeLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizzes", {
      courseId: args.courseId,
      moduleId: args.moduleId,
      title: args.title,
      description: args.description,
      questions: args.questions,
      timeLimit: args.timeLimit,
      createdAt: Date.now(),
    });
  },
});

export const getQuizzesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_course", q => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const getQuizzesByModule = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_module", q => q.eq("moduleId", args.moduleId))
      .collect();
  },
});

export const getQuizById = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quizId);
  },
});

// Quiz Attempts
export const submitQuizAttempt = mutation({
  args: {
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    answers: v.array(v.number()),
    timeSpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get the quiz to calculate score
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Calculate score
    let score = 0;
    let maxScore = 0;
    quiz.questions.forEach((question, index) => {
      const points = question.points || 1;
      maxScore += points;
      if (args.answers[index] === question.correctAnswer) {
        score += points;
      }
    });

    return await ctx.db.insert("quizAttempts", {
      userId: args.userId,
      quizId: args.quizId,
      answers: args.answers,
      score,
      maxScore,
      completedAt: Date.now(),
      timeSpent: args.timeSpent,
    });
  },
});

export const getUserQuizAttempts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .collect();
  },
});

export const getQuizAttempts = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizAttempts")
      .withIndex("by_quiz", q => q.eq("quizId", args.quizId))
      .collect();
  },
});

export const getUserQuizAttempt = query({
  args: {
    userId: v.id("users"),
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizAttempts")
      .withIndex("by_user_quiz", q =>
        q.eq("userId", args.userId).eq("quizId", args.quizId)
      )
      .order("desc")
      .first();
  },
});