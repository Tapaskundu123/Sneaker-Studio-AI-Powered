import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export default function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value ?? null;

  // ✅ Allow static assets & APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // 🧭 Case 1: Not authenticated
  if (!token) {
    if (isAuthPage) return NextResponse.next(); // allow login/signup pages
    return NextResponse.redirect(new URL("/sign-in", origin)); // go to sign-in
  }

  // 🧭 Case 2: Authenticated
  if (isAuthPage) {
    // logged-in users visiting sign-in/up → send home
    return NextResponse.redirect(new URL("/", origin));
  }

  // ✅ Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
