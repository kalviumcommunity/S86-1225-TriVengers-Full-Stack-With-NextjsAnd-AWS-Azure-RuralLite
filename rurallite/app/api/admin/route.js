import { NextResponse } from "next/server";
import { sendSuccess } from "../../../lib/responseHandler";
/** * GET /api/admin * Admin dashboard statistics (Admin only) */ export async function GET(
  req
) {
  const userEmail = req.headers.get("x-user-email");
  const userRole = req.headers.get("x-user-role");
  return sendSuccess(
    {
      message: "Welcome to Admin Dashboard!",
      access: "Full administrative access granted",
      user: { email: userEmail, role: userRole },
      permissions: [
        "View all users",
        "Delete users",
        "Manage content",
        "View analytics",
        "System settings",
      ],
    },
    "Admin access verified",
    200
  );
}
