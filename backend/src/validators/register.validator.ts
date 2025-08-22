import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email().trim().lowercase(),
    password: z.string().min(8).max(25),
    confirmPassword: z.string().min(8).max(25),
    workspaceName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
