import z from "zod";

export const adminInviteSchema = z.object({
  email: z.string().email().trim().lowercase(),
  role: z.enum(["freelancer", "client", "agencyAdmin", "readOnly"]),
});
