import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { getCurrentUser } from "../../../../lib/roleMiddleware";
import { devError } from "../../../../lib/utils/devLogger";

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 * Requires valid JWT token in Authorization header
 */
export async function GET(req) {
    try {
        // Get user info from middleware headers
        const currentUser = getCurrentUser(req);

        if (!currentUser) {
            return sendError(
                "Authentication required. Please provide a valid token.",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Fetch user from database
        const usersCollection = await getCollection("users");
        const userData = await usersCollection.findOne(
            { email: currentUser.email },
            { projection: { password: 0 } }
        );

        if (!userData) {
            return sendError(
                "User not found",
                ERROR_CODES.NOT_FOUND,
                404
            );
        }

        const user = {
            id: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: userData.role,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        };

        return sendSuccess(
            user,
            "Profile fetched successfully",
            200
        );
    } catch (error) {
        devError("Get profile error:", error);
        return sendError(
            "Failed to fetch profile",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
} 