import jwt from "jsonwebtoken";

// JWT Secrets - In production, these should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

// Token expiry times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * JWT Token Structure:
 * 
 * Header: { alg: "HS256", typ: "JWT" }
 * Payload: { id, email, role, exp, iat }
 * Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
 */

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - User data to encode { id, email, role }
 * @returns {string} - JWT access token
 */
export function generateAccessToken(payload) {
    return jwt.sign(
        {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            type: "access",
        },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
}

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - User data to encode { id, email }
 * @returns {string} - JWT refresh token
 */
export function generateRefreshToken(payload) {
    return jwt.sign(
        {
            id: payload.id,
            email: payload.email,
            type: "refresh",
        },
        REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
}

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object { id, email, role }
 * @returns {Object} - { accessToken, refreshToken }
 */
export function generateTokenPair(user) {
    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
    });

    return { accessToken, refreshToken };
}

/**
 * Verify Access Token
 * @param {string} token - JWT access token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Verify it's an access token
        if (decoded.type !== "access") {
            return null;
        }

        return decoded;
    } catch (error) {
        // Token is invalid, expired, or malformed
        if (error.name === "TokenExpiredError") {
            console.log("Access token expired");
        } else if (error.name === "JsonWebTokenError") {
            console.log("Invalid access token");
        }
        return null;
    }
}

/**
 * Verify Refresh Token
 * @param {string} token - JWT refresh token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET);

        // Verify it's a refresh token
        if (decoded.type !== "refresh") {
            return null;
        }

        return decoded;
    } catch (error) {
        // Token is invalid, expired, or malformed
        if (error.name === "TokenExpiredError") {
            console.log("Refresh token expired");
        } else if (error.name === "JsonWebTokenError") {
            console.log("Invalid refresh token");
        }
        return null;
    }
}

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload (unverified)
 */
export function decodeToken(token) {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export function isTokenExpired(token) {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
}

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {number|null} - Expiry timestamp or null
 */
export function getTokenExpiry(token) {
    const decoded = decodeToken(token);
    return decoded?.exp || null;
}

/**
 * Get time remaining until token expires (in seconds)
 * @param {string} token - JWT token
 * @returns {number} - Seconds until expiry (negative if expired)
 */
export function getTimeUntilExpiry(token) {
    const expiry = getTokenExpiry(token);
    if (!expiry) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return expiry - currentTime;
}

export const TOKEN_CONFIG = {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_EXPIRY_MS: 15 * 60 * 1000, // 15 minutes in milliseconds
    REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Alias for backward compatibility
export const verifyToken = verifyAccessToken;
