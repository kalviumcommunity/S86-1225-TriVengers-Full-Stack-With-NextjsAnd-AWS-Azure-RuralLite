import jwt from "jsonwebtoken";
import { sendError } from "./responseHandler";
import { ERROR_CODES } from "./errorCodes";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Middleware to verify JWT token from request headers
 * @param {Request} req - The incoming request object
 * @returns {Object|null} - Decoded user data or null if invalid
 */
export function verifyToken(req) {
    try {
        // Get authorization header
        const authHeader = req.headers.get("authorization");

        if (!authHeader) {
            return null;
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.split(" ")[1];

        if (!token) {
            return null;
        }

        // Verify and decode token
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
}

/**
 * Higher-order function to protect routes with JWT authentication
 * @param {Function} handler - The route handler function
 * @returns {Function} - Protected route handler
 */
export function withAuth(handler) {
    return async (req, context) => {
        const user = verifyToken(req);

        if (!user) {
            return sendError(
                "Authentication required. Please provide a valid token.",
                ERROR_CODES.UNAUTHORIZED,
                401
            );
        }

        // Attach user to request for use in handler
        req.user = user;

        return handler(req, context);
    };
}

/**
 * Middleware to check if user has specific role
 * @param {Request} req - The incoming request object
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {boolean} - Whether user has permission
 */
export function checkRole(user, allowedRoles) {
    if (!user || !user.role) {
        return false;
    }

    return allowedRoles.includes(user.role);
}
