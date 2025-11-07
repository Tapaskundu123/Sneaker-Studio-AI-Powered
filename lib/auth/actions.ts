'use server';

import { z } from "zod";

// ——————————————————————
// Sign-Up Schema
// ——————————————————————
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpData = z.infer<typeof signUpSchema>;

// ——————————————————————
// Sign-In Schema
// ——————————————————————
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInData = z.infer<typeof signInSchema>;

// ——————————————————————
// Sign-Up Action
// ——————————————————————
export async function signUp(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signUpSchema.safeParse(rawData);
  if (!result.success) {
    return { error: "Invalid data", details: result.error.format() };
  }

  // TODO: Save to DB (Prisma, etc.)
  console.log("Sign up:", result.data);

  return { success: true, message: "Account created!" };
}

// ——————————————————————
// Sign-In Action
// ——————————————————————
export async function signIn(formData: FormData){
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signInSchema.safeParse(rawData);
  if (!result.success) {
    return { error: "Invalid credentials", details: result.error.format() };
  }

  // TODO: Verify user + password (bcrypt)
  console.log("Sign in attempt:", result.data);

  // Fake success for now
  return { success: true, message: "Signed in!" };
}