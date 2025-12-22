import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes and their required roles
  const protectedRoutes = {
    "/api/admin": ["ADMIN"],
    "/api/users": ["ADMIN", "TEACHER", "STUDENT"], // All authenticated users
    "/api/auth/me": ["ADMIN", "TEACHER", "STUDENT"], // All authenticated users
  };

  // Check if current path matches any protected API route
  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required. Token missing.",
        },
        { status: 401 }
      );
    }

    try {
      // Verify JWT token using jose (edge-compatible)
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Check if user has required role
      const requiredRoles = protectedRoutes[matchedRoute];
      if (!requiredRoles.includes(payload.role)) {
        return NextResponse.json(
          {
            success: false,
            message: `Access denied. Required role: ${requiredRoles.join(" or ")}`,
          },
          { status: 403 }
        );
      }

      // Attach user info to headers for downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.id.toString());
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-role", payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 403 }
      );
    }
  }

  // Protect app pages (dashboard, users) using cookie-based JWT
  const protectedPages = ["/dashboard", "/users"];
  const isProtectedPage = protectedPages.some((p) => pathname.startsWith(p));

  if (isProtectedPage) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/users/:path*",
    "/api/auth/me",
    "/dashboard/:path*",
    "/users/:path*",
  ],
};
