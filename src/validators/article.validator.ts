import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  isPublished: z.boolean().optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  isPublished: z.boolean().optional(),
});