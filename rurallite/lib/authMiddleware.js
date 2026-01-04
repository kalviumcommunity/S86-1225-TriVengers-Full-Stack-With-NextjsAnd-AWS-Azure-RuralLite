import { sendError } from "./responseHandler";
import { ERROR_CODES } from "./errorCodes";
import { verifyAccessToken } from "./jwtUtils";

/**
 * Middleware to verify JWT access token from request headers
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

    // Verify and decode access token
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Higher-order function to protect routes with JWT authentication
 * Returns 401 if token is missing, invalid, or expired
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
