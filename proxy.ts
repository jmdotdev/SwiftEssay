import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt"

const roleAccess: Record<string, string[]> = {
  admin: ["/admin", "/admin"],
  writer: ["/writer", "/writer"],
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  if (!token) {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.next()
    }

    // block protected routes
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const user = verifyToken(token) as { role: string }

    // 2. Prevent logged-in users from going back to login/register
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.redirect(new URL("/writer", req.url))

    }

    //role-based access
    const allowedRoutes = roleAccess[user.role] || []

    const isAllowed = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  } catch (err) {
    // Invalid or expired token
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/writer/:path*",
    "/login",
    "/register",
  ],
}