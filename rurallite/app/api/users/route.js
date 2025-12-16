import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10)
    );
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return sendSuccess(users, "Users fetched successfully", 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return sendError("Failed to fetch users", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, role } = body || {};

    if (!name || typeof name !== "string") {
      return sendError("Invalid 'name'", ERROR_CODES.VALIDATION_ERROR, 400);
    }
    if (!email || typeof email !== "string") {
      return sendError("Invalid 'email'", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError("Email already exists", ERROR_CODES.CONFLICT, 409);
    }

    const user = await prisma.user.create({
      data: { name, email, role: role || "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(user, "User created successfully", 201);
  } catch (error) {
    return sendError("User creation failed", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
