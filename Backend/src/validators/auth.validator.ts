import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(1).max(50),
  email: z.email().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (value) => value.trim().length > 0,
      "Password cannot contain only spaces",
    ),
});

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (value) => value.trim().length > 0,
      "Password cannot contain only spaces",
    ),
});

export const googleAuthSchema = z.object({
  code: z.string().trim().min(1, "Google authorization code is required"),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
