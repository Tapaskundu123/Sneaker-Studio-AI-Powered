"use server";

import { z } from "zod";
import { mockUsers } from "../mock-data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SignInForm = { email: string; password: string };
type SignUpForm = { name: string; email: string; password: string };

/* ---------- Schemas ---------- */
const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

/* ---------- Helper: Set Auth Cookie ---------- */
async function setAuthCookie(userId: string) {
  const cookieStore = await cookies(); // ✅ Await for server actions
  cookieStore.set("auth-token", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/* ---------- signIn ---------- */
export async function signIn(formData: FormData) {
  const raw: SignInForm = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.format();
    return {
      error: "Validation failed",
      fields: {
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      },
    };
  }

  const user = mockUsers.find(
    (u) =>
      u.email === parsed.data.email && u.password === parsed.data.password
  );

  if (!user) {
    return { error: "Invalid email or password" };
  }

  await setAuthCookie(user.id); // ✅ fixed

  const redirectTo = formData.get("redirect")?.toString();
  redirect(redirectTo || "/customizer");
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
    const fieldErrors = parsed.error.format();
    return {
      error: "Validation failed",
      fields: {
        name: fieldErrors.name?._errors[0],
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      },
    };
  }

  const exists = mockUsers.some((u) => u.email === parsed.data.email);
  if (exists) {
    return { error: "Email already taken", fields: { email: "Email in use" } };
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password, // ⚠ TODO: hash with bcrypt
  };

  mockUsers.push(newUser);
  await setAuthCookie(newUser.id); // ✅ fixed

  const redirectTo = formData.get("redirect")?.toString();
  redirect(redirectTo || "/customizer");
}

/* ---------- logout (optional helper) ---------- */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token"); // ✅ properly clears cookie
  redirect("/sign-in");
}
