// lib/auth/actions.ts
"use server";

import { z } from "zod";
import { mockUsers } from "../mock-data";
import { redirect } from "next/navigation";
import type { SignInForm, SignUpForm } from "../types";

/* ---------- Schemas ---------- */
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

/* ---------- Helper (pretend JWT) ---------- */
function setAuthCookie(userId: string) {
  // In a real app you would set an httpOnly cookie with a JWT.
  // For demo we just store in localStorage on client side later.
}

/* ---------- signIn ---------- */
export async function signIn(formData: FormData) {
  const raw: SignInForm = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }

  const user = mockUsers.find(
    (u) => u.email === parsed.data.email && u.password === parsed.data.password
  );

  if (!user) return { error: "Invalid email or password" };

  setAuthCookie(user.id);
  redirect("/customizer");
}

/* ---------- signUp ---------- */
export async function signUp(formData: FormData) {
  const raw: SignUpForm = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }

  const exists = mockUsers.some((u) => u.email === parsed.data.email);
  if (exists) return { error: "Email already taken" };

  // In real app: hash password + Prisma create
  const newUser = {
    id: crypto.randomUUID(),
    email: parsed.data.email,
    password: parsed.data.password, // <-- hash later
  };
  mockUsers.push(newUser);
  setAuthCookie(newUser.id);
  redirect("/customizer");
}