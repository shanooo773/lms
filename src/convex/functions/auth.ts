// src/convex/functions/auth.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Simple password hashing function (for demo purposes)
// In production, use proper bcrypt or similar
function hashPassword(password: string): string {
  // Simple hash - in production use bcrypt
  return btoa(password + "salt123");
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.optional(v.union(v.literal("student"), v.literal("instructor"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email))
      .unique();
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = hashPassword(args.password);

    // Create user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role || "student",
      createdAt: Date.now(),
      password: hashedPassword,
    });

    return {
      userId,
      name: args.name,
      email: args.email,
      role: args.role || "student",
    };
  },
});

export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email))
      .unique();
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    if (!user.password || !verifyPassword(args.password, user.password)) {
      throw new Error("Invalid email or password");
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // If updating email, check if it's already taken
    if (updates.email && typeof updates.email === 'string') {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", q => q.eq("email", updates.email as string))
        .unique();
      
      if (existingUser && existingUser._id !== userId) {
        throw new Error("Email is already taken");
      }
    }

    // Hash password if provided
    if (updates.password) {
      updates.password = hashPassword(updates.password);
    }

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(userId, filteredUpdates);

    // Return updated user data (without password)
    const updatedUser = await ctx.db.get(userId);
    return {
      userId: updatedUser!._id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      role: updatedUser!.role,
    };
  },
});

export const getCurrentUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    
    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  },
});