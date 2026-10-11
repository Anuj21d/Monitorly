import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(1).max(50),
  email: z.email().trim(),
  password: z
    .string()
    .min(8)
    .refine((value) => {
      value.trim().length > 0;
    }),
});
