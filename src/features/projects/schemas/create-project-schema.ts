import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must contain at least 3 characters.")
    .max(60, "Project name cannot exceed 60 characters."),
});

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;