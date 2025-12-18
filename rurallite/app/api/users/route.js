import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { userSchema } from "../../../lib/schemas/userSchema";
import { verifyToken } from "../../../lib/authMiddleware";
import { ZodError } from "zod";
import { handleError } from "../../../lib/errorHandler";

export async function GET(req) {
  try {
    // Optional: Protect this route - only authenticated users can list users
    const user = verifyToken(req);
    if (!user) {
      return sendError(
        "Authentication required. Please provide a valid token.",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }
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
    return handleError(error, "GET /api/users");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    try {
      const data = userSchema.parse(body);

      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        return sendError("Email already exists", ERROR_CODES.CONFLICT, 409);
      }

      const user = await prisma.user.create({
        data: { name: data.name, email: data.email, role: data.role || "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return sendSuccess(user, "User created successfully", 201);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleError(err, "POST /api/users (validation)");
      }
      throw err;
    }
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}
