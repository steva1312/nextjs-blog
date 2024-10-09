import { z } from "zod";

//sign up
export const signUpSchema = z.object({
  fullName: z.string().min(1, "Missing field"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

//sign in
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Missing field")
});

export type SignInSchema = z.infer<typeof signInSchema>;

//forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

//reset password
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;