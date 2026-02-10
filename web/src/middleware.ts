import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // For now, allow all routes in development
  // To protect dashboard routes, uncomment:
  // if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
