import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard", "/scams", "/subscriptions", "/privacy", "/price-watch",
  "/alerts", "/settings", "/checkout",
];

export default auth((req) => {
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
