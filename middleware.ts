import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/", "/about"];
const apiPaths = ["/api/users/login", "/api/users/register", "/api/users/me"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  const pathname = request.nextUrl.pathname;

  const isPublicPath = publicPaths.includes(pathname);
  const isApiPath = pathname.startsWith("/api") || apiPaths.includes(pathname);

  if (!isPublicPath && !isApiPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
