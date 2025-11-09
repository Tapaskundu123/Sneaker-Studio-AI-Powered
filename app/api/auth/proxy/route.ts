// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isAuthPage =
    pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up");

  // Allow public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo.png")
  ) {
    return NextResponse.next();
  }

  // UNAUTHENTICATED USER
  if (!token) {
    if (isAuthPage) {
      return NextResponse.next(); // Allow sign-in/up
    }
    const loginUrl = new URL("/auth/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname + searchParams.toString());
    return NextResponse.redirect(loginUrl);
  }

  // AUTHENTICATED USER visiting sign-in/up → redirect to dashboard/customizer
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/customizer", request.url));
  }

  return NextResponse.next();
}

// ✅ Match all routes except API & static assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};