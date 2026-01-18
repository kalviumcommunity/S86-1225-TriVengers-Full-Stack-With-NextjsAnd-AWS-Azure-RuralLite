import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { handleError } from "../../../../lib/errorHandler";
import { getRequestContext } from "../../../../lib/requestContext";

/**
 * GET /api/admin/users
 * Get all users with detailed information (Admin only)
 */
export async function GET(req) {
    try {
        const requestContext = getRequestContext(req, "GET /api/admin/users");

        // Get user info from middleware headers
        const userRole = req.headers.get("x-user-role");
        const userEmail = req.headers.get("x-user-email");

        // Fetch all users with full details
        const usersCollection = await getCollection("users");
        const usersData = await usersCollection
            .find({})
            .project({ password: 0 })
            .sort({ createdAt: -1 })
            .toArray();

        const users = usersData.map(user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

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
        const requestContext = getRequestContext(req, "GET /api/admin/users");
        return handleError(error, "GET /api/admin/users", requestContext.withMeta());
    }
}

/**
 * DELETE /api/admin/users
 * Delete a user by ID (Admin only)
 */
export async function DELETE(req) {
    try {
        const requestContext = getRequestContext(req, "DELETE /api/admin/users");
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return sendError(
                "User ID is required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        if (!ObjectId.isValid(userId)) {
            return sendError(
                "Invalid user ID",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        const usersCollection = await getCollection("users");
        const userToDelete = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!userToDelete) {
            return sendError("User not found", ERROR_CODES.NOT_FOUND, 404);
        }

        await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        const deletedUser = {
            id: userToDelete._id.toString(),
            name: userToDelete.name,
            email: userToDelete.email,
        };

        return sendSuccess(
            deletedUser,
            "User deleted successfully",
            200
        );
    } catch (error) {
        const requestContext = getRequestContext(req, "DELETE /api/admin/users");
        return handleError(error, "DELETE /api/admin/users", requestContext.withMeta());
    }
} 