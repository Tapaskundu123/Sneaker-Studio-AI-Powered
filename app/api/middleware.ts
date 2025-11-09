// middleware.ts   (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED = ["/dashboard", "/profile", "/api/protected"]; // add your paths

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public assets / api/auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    // not logged in → redirect to sign-in
    if (PROTECTED.some((p) => pathname.startsWith(p))) {
      const url = new URL("/sign-in", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    const payload = await verifyToken(token);
    // attach userId to request headers for downstream APIs
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    return response;
  } catch (err) {
    // invalid token → clear cookie & redirect
    const response = NextResponse.redirect(new URL("/sign-in", req.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};