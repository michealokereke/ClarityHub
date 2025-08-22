import z, { email, string } from "zod";

export const loginSchema = z.object({
  email: z.string().email().trim().lowercase(),
  password: z.string().min(8).max(25),
});
