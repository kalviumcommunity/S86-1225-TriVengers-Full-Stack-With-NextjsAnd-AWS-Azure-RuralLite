import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { handleError } from "../../../../lib/errorHandler";

/**
 * GET /api/admin/users
 * Get all users with detailed information (Admin only)
 */
export async function GET(req) {
    try {
        // Get user info from middleware headers
        const userRole = req.headers.get("x-user-role");
        const userEmail = req.headers.get("x-user-email");

        // Fetch all users with full details
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return sendSuccess(
            users,
            `Admin access granted. Viewing all ${users.length} users.`,
            200,
            {
                adminEmail: userEmail,
                totalUsers: users.length,
            }
        );
    } catch (error) {
        return handleError(error, "GET /api/admin/users");
    }
}

/**
 * DELETE /api/admin/users
 * Delete a user by ID (Admin only)
 */
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return sendError(
                "User ID is required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return sendSuccess(
            deletedUser,
            "User deleted successfully",
            200
        );
    } catch (error) {
        return handleError(error, "DELETE /api/admin/users");
    }
}
