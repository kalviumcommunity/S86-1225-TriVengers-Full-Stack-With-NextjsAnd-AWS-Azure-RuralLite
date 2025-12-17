import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";

// JWT Secret - In production, this should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(req) {
    try {
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
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return sendError(
                "Invalid credentials",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return sendError(
                "Invalid credentials",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Generate JWT token
        // Token contains user id, email, and role
        // Expires in 24 hours
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Return success with token and user info (excluding password)
        return sendSuccess(
            {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            "Login successful",
            200
        );
    } catch (error) {
        console.error("Login error:", error);
        return sendError(
            "Login failed",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
