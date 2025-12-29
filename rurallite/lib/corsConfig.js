/**
 * CORS Configuration Utility
 *
 * Provides secure Cross-Origin Resource Sharing (CORS) configuration
 * to control which domains can access your API endpoints.
 *
 * SECURITY NOTE:
 * - Never use '*' in production for allowed origins
 * - Always specify exact domains that should have API access
 * - Update ALLOWED_ORIGINS based on your deployment environment
 */

// Allowed origins based on environment
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://rurallite.vercel.app", // Update with your production domain
  "https://your-production-domain.com", // Update with your actual domain
  // Add more allowed origins as needed
];

// For development, you might want to allow all localhost ports
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Check if an origin is allowed to access the API
 * @param {string} origin - The requesting origin
 * @returns {boolean} - Whether the origin is allowed
 */
export function isOriginAllowed(origin) {
  if (!origin) return false;

  // In development, allow all localhost origins
  if (isDevelopment && origin.startsWith("http://localhost")) {
    return true;
  }

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get CORS headers for a response
 * @param {string} origin - The requesting origin
 * @returns {Object} - CORS headers object
 */
export function getCorsHeaders(origin) {
  const headers = {};

  // Only set Access-Control-Allow-Origin if origin is allowed
  if (isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  headers["Access-Control-Allow-Methods"] =
    "GET, POST, PUT, PATCH, DELETE, OPTIONS";
  headers["Access-Control-Allow-Headers"] =
    "Content-Type, Authorization, X-Requested-With";
  headers["Access-Control-Max-Age"] = "86400"; // 24 hours

  return headers;
}

/**
 * Apply CORS headers to a NextResponse
 * @param {NextResponse} response - The response object
 * @param {string} origin - The requesting origin
 * @returns {NextResponse} - Response with CORS headers applied
 */
export function applyCorsHeaders(response, origin) {
  const corsHeaders = getCorsHeaders(origin);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Create a preflight response for OPTIONS requests
 * @param {string} origin - The requesting origin
 * @returns {Response} - Preflight response with CORS headers
 */
export function createPreflightResponse(origin) {
  const headers = getCorsHeaders(origin);

  return new Response(null, {
    status: 204,
    headers,
  });
}
