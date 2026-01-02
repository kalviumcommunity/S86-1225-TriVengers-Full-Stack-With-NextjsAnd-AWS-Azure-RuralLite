import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { userSchema } from "../../../lib/schemas/userSchema";
import { verifyToken } from "../../../lib/authMiddleware";
import { ZodError } from "zod";
import { handleError } from "../../../lib/errorHandler";
import redis from "../../../lib/redis";
import { logger } from "../../../lib/logger";
import { getRequestContext } from "../../../lib/requestContext";

const USERS_CACHE_TTL_SECONDS = 60;

const buildUsersCacheKey = (page, limit) => `users:list:p${page}:l${limit}`;

export async function GET(req) {
  try {
    const requestContext = getRequestContext(req, "GET /api/users");
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

    const cacheKey = buildUsersCacheKey(page, limit);

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        logger.info("users:list cache hit", requestContext.withMeta({ cacheKey }));
        return sendSuccess(
          parsed.users,
          "Users fetched successfully",
          200,
          parsed.meta
        );
      }
    } catch (cacheError) {
      logger.warn("users:list cache read failed", requestContext.withMeta({
        cacheKey,
        error: cacheError?.message,
      }));
    }

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

    const meta = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    try {
      await redis.set(
        cacheKey,
        JSON.stringify({ users, meta }),
        "EX",
        USERS_CACHE_TTL_SECONDS
      );
      logger.info("users:list cache set", requestContext.withMeta({
        cacheKey,
        ttlSeconds: USERS_CACHE_TTL_SECONDS,
      }));
    } catch (cacheError) {
      logger.warn("users:list cache write failed", requestContext.withMeta({
        cacheKey,
        error: cacheError?.message,
      }));
    }

    return sendSuccess(users, "Users fetched successfully", 200, meta);
  } catch (error) {
    const requestContext = getRequestContext(req, "GET /api/users");
    return handleError(error, "GET /api/users", requestContext.withMeta());
  }
}

export async function POST(req) {
  try {
    const requestContext = getRequestContext(req, "POST /api/users");
    const body = await req.json();
    try {
      const data = userSchema.parse(body);

      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing) {
        return sendError("Email already exists", ERROR_CODES.CONFLICT, 409);
      }

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          role: data.role || "STUDENT",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      try {
        const keys = await redis.keys("users:list:*");
        if (keys.length) {
          await redis.del(...keys);
          logger.info("users:list cache invalidated", requestContext.withMeta({ keys }));
        }
      } catch (cacheError) {
        logger.warn("users:list cache invalidation failed", requestContext.withMeta({
          error: cacheError?.message,
        }));
      }

      return sendSuccess(user, "User created successfully", 201);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleError(err, "POST /api/users (validation)", requestContext.withMeta());
      }
      throw err;
    }
  } catch (error) {
    const requestContext = getRequestContext(req, "POST /api/users");
    return handleError(error, "POST /api/users", requestContext.withMeta());
  }
}
