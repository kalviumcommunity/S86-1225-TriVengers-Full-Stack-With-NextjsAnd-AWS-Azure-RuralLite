import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getCollection } from "../../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { generateTokenPair } from "../../../../lib/jwtUtils";
import { logger } from "../../../../lib/logger";
import { getRequestContext } from "../../../../lib/requestContext";

export async function POST(req) {
    try {
        const requestContext = getRequestContext(req, "POST /api/auth/login");
        const body = await req.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return sendError(
                "Missing required fields: email and password are required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        // Find user by email
        logger.info("login attempt", requestContext.withMeta({ email }));
        const usersCollection = await getCollection("users");
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return sendError("Invalid credentials", ERROR_CODES.UNAUTHORIZED, 401);
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return sendError("Invalid credentials", ERROR_CODES.UNAUTHORIZED, 401);
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Build response
        const res = NextResponse.json(
            {
                success: true,
                message: "Login successful",
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

        // Set cookies with security options
        const isProd = process.env.NODE_ENV === "production";

        // Access token cookie (for page middleware)
        res.cookies.set("token", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 15, // 15 minutes
        });

        // Refresh token cookie (HTTP-only, more secure)
        res.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        logger.info(
            "login success",
            requestContext.withMeta({
                userId: user._id.toString(),
                role: user.role,
            })
        );

        return res;
    } catch (error) {
        const requestContext = getRequestContext(req, "POST /api/auth/login");
        logger.error(
            "login failed",
            requestContext.withMeta({ error: error?.message })
        );

        return sendError(
            "Login failed",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
