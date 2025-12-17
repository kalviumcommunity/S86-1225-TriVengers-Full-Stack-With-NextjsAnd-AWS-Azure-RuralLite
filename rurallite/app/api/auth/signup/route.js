import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return sendError(
                "Missing required fields: name, email, and password are required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(
                "Invalid email format",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            return sendError(
                "Password must be at least 6 characters long",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return sendError(
                "User with this email already exists",
                ERROR_CODES.CONFLICT,
                409
            );
        }

        // Hash the password with bcrypt (10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with hashed password
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "STUDENT", // Default role is STUDENT
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return sendSuccess(
            newUser,
            "User registered successfully",
            201
        );
    } catch (error) {
        console.error("Signup error:", error);
        return sendError(
            "Signup failed",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
