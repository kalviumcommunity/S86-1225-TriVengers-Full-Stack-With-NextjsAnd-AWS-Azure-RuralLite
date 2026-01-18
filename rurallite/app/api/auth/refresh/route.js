import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCollection } from "../../../../lib/mongodb";
import { sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import {
    verifyRefreshToken,
    generateTokenPair,
} from "../../../../lib/jwtUtils";
import { devError } from "../../../../lib/utils/devLogger";

/**
 * POST /api/auth/refresh
 *
 * Refresh access token using refresh token
 *
 * Flow:
 * 1. Client sends refresh token (from HTTP-only cookie)
 * 2. Server verifies refresh token
 * 3. If valid, generate new access + refresh token pair
 * 4. Return new access token and set new cookies
 * 5. Old refresh token is invalidated (token rotation)
 */
export async function POST(req) {
    try {
        // Get refresh token from cookie
        const cookieStore = cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return sendError(
                "Refresh token not provided",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return sendError(
                "Invalid or expired refresh token",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Verify user still exists
        const usersCollection = await getCollection("users");
        const user = await usersCollection.findOne(
            { email: decoded.email },
            { projection: { password: 0 } }
        );

        if (!user) {
            return sendError("User not found", ERROR_CODES.NOT_FOUND, 404);
        }

        // Generate new token pair (token rotation)
        const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Build response
        const res = NextResponse.json(
            {
                success: true,
                message: "Token refreshed successfully",
                data: {
                    accessToken,
                    user: {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                },
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );

        // Set new cookies
        const isProd = process.env.NODE_ENV === "production";

        // New access token cookie
        res.cookies.set("token", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 15, // 15 minutes
        });

        // New refresh token cookie (rotation)
        res.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (error) {
        devError("Token refresh error:", error);
        return sendError(
            "Failed to refresh token",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
} 