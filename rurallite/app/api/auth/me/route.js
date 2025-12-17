import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { verifyToken } from "../../../../lib/authMiddleware";

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 * Requires valid JWT token in Authorization header
 */
export async function GET(req) {
    try {
        // Verify JWT token
        const decoded = verifyToken(req);

        if (!decoded) {
            return sendError(
                "Authentication required. Please provide a valid token.",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return sendError(
                "User not found",
                ERROR_CODES.NOT_FOUND,
                404
            );
        }

        return sendSuccess(
            user,
            "Profile fetched successfully",
            200
        );
    } catch (error) {
        console.error("Get profile error:", error);
        return sendError(
            "Failed to fetch profile",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
