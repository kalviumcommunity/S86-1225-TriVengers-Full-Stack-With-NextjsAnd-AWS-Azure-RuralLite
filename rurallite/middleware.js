import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { applyCorsHeaders, createPreflightResponse } from "./lib/corsConfig";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin") || "";
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  const attachRequestId = (response) => {
    response.headers.set("x-request-id", requestId);
    return response;
  };

  // Handle preflight OPTIONS requests for CORS
  if (request.method === "OPTIONS") {
    const res = createPreflightResponse(origin);
    attachRequestId(res);
    return res;
  }

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
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-request-id", requestId);

    if (!token) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Authentication required. Token missing.",
        },
        { status: 401 }
      );
      return applyCorsHeaders(attachRequestId(response), origin);
    }

    try {
      // Verify JWT token using jose (edge-compatible)
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Check if user has required role
      const requiredRoles = protectedRoutes[matchedRoute];
      if (!requiredRoles.includes(payload.role)) {
        const response = NextResponse.json(
          {
            success: false,
            message: `Access denied. Required role: ${requiredRoles.join(" or ")}`,
          },
          { status: 403 }
        );
        return applyCorsHeaders(attachRequestId(response), origin);
      }

      // Attach user info to headers for downstream handlers
      requestHeaders.set("x-user-id", payload.id.toString());
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-role", payload.role);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      return applyCorsHeaders(attachRequestId(response), origin);
    } catch (error) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 403 }
      );
      return applyCorsHeaders(attachRequestId(response), origin);
    }
  }

  // Apply CORS headers to all API routes (public and protected)
  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-request-id", requestId);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return applyCorsHeaders(attachRequestId(response), origin);
  }

  // Protect app pages (dashboard, users) using cookie-based JWT
  const protectedPages = ["/dashboard", "/users"];
  const isProtectedPage = protectedPages.some((p) => pathname.startsWith(p));

  if (isProtectedPage) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const url = new URL("/login", request.url);
        return attachRequestId(NextResponse.redirect(url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
        return attachRequestId(NextResponse.next());
    } catch (err) {
      const url = new URL("/login", request.url);
        return attachRequestId(NextResponse.redirect(url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  return attachRequestId(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  );
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/api/:path*", // Apply to all API routes for CORS
    "/dashboard/:path*",
    "/users/:path*",
  ],
};
