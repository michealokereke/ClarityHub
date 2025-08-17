import z, { email, string } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(25),
    company: z.string().optional(),
    confirmPassword: z.string().min(8).max(25),
    plan: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmpassword"],
    message: "password not matching",
  });
