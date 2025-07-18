import { query } from "../_generated/server";
import { v } from "convex/values";

// Search & Filter Functions
export const searchCourses = query({
  args: {
    searchTerm: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    tagIds: v.optional(v.array(v.id("tags"))),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    instructorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let courses = await ctx.db.query("courses").collect();

    // Filter by search term
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (args.categoryId) {
      const courseCategories = await ctx.db
        .query("courseCategories")
        .withIndex("by_category", q => q.eq("categoryId", args.categoryId!))
        .collect();
      
      const courseIdsInCategory = new Set(courseCategories.map(cc => cc.courseId));
      courses = courses.filter(course => courseIdsInCategory.has(course._id));
    }

    // Filter by tags
    if (args.tagIds && args.tagIds.length > 0) {
      const courseTagsPromises = args.tagIds.map(tagId =>
        ctx.db
          .query("courseTags")
          .withIndex("by_tag", q => q.eq("tagId", tagId))
          .collect()
      );
      
      const courseTagsResults = await Promise.all(courseTagsPromises);
      const courseIdsWithTags = new Set();
      
      courseTagsResults.forEach(courseTags => {
        courseTags.forEach(ct => courseIdsWithTags.add(ct.courseId));
      });
      
      courses = courses.filter(course => courseIdsWithTags.has(course._id));
    }

    // Filter by price range
    if (args.minPrice !== undefined) {
      courses = courses.filter(course => course.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      courses = courses.filter(course => course.price <= args.maxPrice!);
    }

    // Filter by instructor
    if (args.instructorId) {
      courses = courses.filter(course => course.instructorId === args.instructorId);
    }

    return courses;
  },
});

// Dashboard Analytics
export const getInstructorDashboard = query({
  args: { instructorId: v.id("users") },
  handler: async (ctx, args) => {
    // Get instructor courses
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_instructor", q => q.eq("instructorId", args.instructorId))
      .collect();

    // Get enrollment stats
    let totalStudents = 0;
    let totalRevenue = 0;
    
    for (const course of courses) {
      const enrollments = await ctx.db
        .query("enrollments")
        .withIndex("by_course", q => q.eq("courseId", course._id))
        .collect();
      
      totalStudents += enrollments.length;
      totalRevenue += enrollments.filter(e => e.paymentStatus === "paid").length * course.price;
    }

    return {
      totalCourses: courses.length,
      totalStudents,
      totalRevenue,
      courses: courses.map(course => ({
        ...course,
        studentCount: 0, // Will be filled in by separate queries if needed
      })),
    };
  },
});

export const getAdminDashboard = query({
  handler: async (ctx) => {
    const [users, courses, enrollments, contactMessages] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("courses").collect(),
      ctx.db.query("enrollments").collect(),
      ctx.db.query("contactMessages").collect(),
    ]);

    const totalRevenue = enrollments
      .filter(e => e.paymentStatus === "paid")
      .reduce((sum, enrollment) => {
        const course = courses.find(c => c._id === enrollment.courseId);
        return sum + (course?.price || 0);
      }, 0);

    return {
      totalUsers: users.length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalRevenue,
      pendingContactMessages: contactMessages.filter(m => m.status === "new").length,
      usersByRole: {
        students: users.filter(u => u.role === "student").length,
        instructors: users.filter(u => u.role === "instructor").length,
        admins: users.filter(u => u.role === "admin").length,
      },
    };
  },
});

export const getCourseAnalytics = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const [course, enrollments, quizzes] = await Promise.all([
      ctx.db.get(args.courseId),
      ctx.db
        .query("enrollments")
        .withIndex("by_course", q => q.eq("courseId", args.courseId))
        .collect(),
      ctx.db
        .query("quizzes")
        .withIndex("by_course", q => q.eq("courseId", args.courseId))
        .collect(),
    ]);

    // Get progress separately since the index structure is different
    const progress = await ctx.db
      .query("progress")
      .filter(q => q.eq(q.field("courseId"), args.courseId))
      .collect();

    if (!course) {
      throw new Error("Course not found");
    }

    const completedProgress = progress.filter(p => p.completed);
    const completionRate = enrollments.length > 0 ? (completedProgress.length / enrollments.length) * 100 : 0;

    return {
      course,
      enrollmentCount: enrollments.length,
      completionRate: Math.round(completionRate),
      quizCount: quizzes.length,
      revenue: enrollments.filter(e => e.paymentStatus === "paid").length * course.price,
    };
  },
});