import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getCollection } from "../../../../lib/mongodb";
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
        const usersCollection = await getCollection("users");
        const existingUser = await usersCollection.findOne({ email });

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
        const newUserData = {
            name,
            email,
            password: hashedPassword,
            role: role || "STUDENT", // Default role is STUDENT
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(newUserData);

        const newUser = {
            id: result.insertedId.toString(),
            name,
            email,
            role: role || "STUDENT",
            createdAt: newUserData.createdAt
        };

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