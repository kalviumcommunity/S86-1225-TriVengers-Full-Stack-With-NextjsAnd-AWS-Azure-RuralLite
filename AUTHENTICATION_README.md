# Authentication APIs - RuralLite

This document provides comprehensive information about the authentication system implemented in RuralLite using bcrypt for password hashing and JWT (JSON Web Tokens) for session management.

## Table of Contents
- [Overview](#overview)
- [Authentication vs Authorization](#authentication-vs-authorization)
- [API Endpoints](#api-endpoints)
- [Implementation Details](#implementation-details)
- [Testing](#testing)
- [Security Considerations](#security-considerations)

## Overview

The RuralLite authentication system implements secure user authentication using industry-standard practices:

- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Management**: JWT tokens with 24-hour expiry
- **Protected Routes**: Middleware-based authentication
- **Role-Based Access**: Support for STUDENT, TEACHER, and ADMIN roles

## Authentication vs Authorization

| Concept | Description | Example |
|---------|-------------|---------|
| **Authentication** | Verifying who the user is | User logs in with email and password |
| **Authorization** | Determining what the user can do | Admin can access admin routes, students cannot |

This implementation focuses on **authentication** with basic role support for future authorization features.

## API Endpoints

### 1. Signup - Create New User

**POST** `/api/auth/signup`

Create a new user account with hashed password.

**Request Body:**
```json
{
  "name": "Alice Test",
  "email": "alice@example.com",
  "password": "securepassword123",
  "role": "STUDENT"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Alice Test",
    "email": "alice@example.com",
    "role": "STUDENT",
    "createdAt": "2025-12-17T10:00:00.000Z"
  },
  "meta": null
}
```

**Error Response (409) - User Exists:**
```json
{
  "success": false,
  "message": "User with this email already exists",
  "error": {
    "code": "E409",
    "details": null
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long",
  "error": {
    "code": "E001",
    "details": null
  }
}
```

**Validations:**
- `name`: Required
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters
- `role`: Optional, defaults to "STUDENT"

---

### 2. Login - Authenticate User

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Alice Test",
      "email": "alice@example.com",
      "role": "STUDENT"
    }
  },
  "meta": null
}
```

**Error Response (401) - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "E401",
    "details": null
  }
}
```

**Token Details:**
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiry**: 24 hours
- **Payload**: Contains user id, email, and role
- **Secret**: Configured via `JWT_SECRET` environment variable

---

### 3. Get Current User Profile (Protected)

**GET** `/api/auth/me`

Get authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "name": "Alice Test",
    "email": "alice@example.com",
    "role": "STUDENT",
    "createdAt": "2025-12-17T10:00:00.000Z",
    "updatedAt": "2025-12-17T10:00:00.000Z"
  },
  "meta": null
}
```

**Error Response (401) - Missing Token:**
```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token.",
  "error": {
    "code": "E401",
    "details": null
  }
}
```

---

### 4. List Users (Protected)

**GET** `/api/users`

List all users (requires authentication).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Alice Test",
      "email": "alice@example.com",
      "role": "STUDENT",
      "createdAt": "2025-12-17T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

## Implementation Details

### Password Hashing with bcrypt

```javascript
import bcrypt from "bcrypt";

// Hash password with 10 salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Why bcrypt?**
- Adaptive: Can increase difficulty as hardware improves
- Salt built-in: Each hash is unique even for same password
- Slow by design: Makes brute-force attacks impractical
- 10 salt rounds: Good balance between security and performance

### JWT Token Generation

```javascript
import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  JWT_SECRET,
  { expiresIn: "24h" }
);
```

**Token Structure:**
```
Header.Payload.Signature
```

**Decoded Payload Example:**
```json
{
  "id": 1,
  "email": "alice@example.com",
  "role": "STUDENT",
  "iat": 1702816800,
  "exp": 1702903200
}
```

### Authentication Middleware

The `authMiddleware.js` provides utility functions for protecting routes:

```javascript
import { verifyToken } from "@/lib/authMiddleware";

export async function GET(req) {
  const user = verifyToken(req);
  
  if (!user) {
    return sendError(
      "Authentication required",
      ERROR_CODES.UNAUTHORIZED,
      401
    );
  }
  
  // Use user.id, user.email, user.role
  // ...
}
```

### File Structure

```
rurallite/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── signup/
│       │   │   └── route.js       # User registration
│       │   ├── login/
│       │   │   └── route.js       # User authentication
│       │   └── me/
│       │       └── route.js       # Get current user profile
│       └── users/
│           └── route.js           # Protected route example
└── lib/
    ├── authMiddleware.js          # JWT verification utilities
    ├── errorCodes.js              # Error code constants
    └── responseHandler.js         # Standard response helpers
```

## Testing

### Using PowerShell

Run the included test script:

```powershell
# Start the Next.js server first
cd rurallite
npm run dev

# In another terminal, run tests
cd ..
.\test-auth-simple.ps1
```

### Using cURL

**1. Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Test",
    "email": "alice@example.com",
    "password": "test123456",
    "role": "STUDENT"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "test123456"
  }'
```

**3. Get Profile (with token):**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. **Create Collection**: "RuralLite Auth"

2. **Signup Request**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/signup`
   - Body (JSON):
     ```json
     {
       "name": "Alice Test",
       "email": "alice@example.com",
       "password": "test123456"
     }
     ```

3. **Login Request**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "alice@example.com",
       "password": "test123456"
     }
     ```
   - Save token from response

4. **Get Profile Request**:
   - Method: GET
   - URL: `http://localhost:3000/api/auth/me`
   - Headers:
     - `Authorization`: `Bearer YOUR_TOKEN_HERE`

## Security Considerations

### 1. Password Security

✅ **Implemented:**
- Passwords hashed with bcrypt (10 salt rounds)
- Minimum 6 character requirement
- Passwords never stored in plain text
- Passwords never returned in API responses

⚠️ **Recommendations for Production:**
- Increase minimum password length to 8-12 characters
- Add password complexity requirements (uppercase, numbers, special chars)
- Implement password strength meter on frontend
- Add password history to prevent reuse

### 2. JWT Token Security

✅ **Implemented:**
- Tokens signed with secret key
- 24-hour expiration
- Tokens sent via Authorization header (not in URL)

⚠️ **Recommendations for Production:**
- Store JWT_SECRET in environment variables (not hardcoded)
- Use strong, randomly generated secret (32+ characters)
- Implement token refresh mechanism
- Consider shorter expiry (1 hour) with refresh tokens
- Add token blacklist for logout functionality

### 3. Token Storage

**Options:**

| Storage | Security | XSS Risk | CSRF Risk | Recommendation |
|---------|----------|----------|-----------|----------------|
| **localStorage** | Medium | High | Low | Avoid for sensitive apps |
| **sessionStorage** | Medium | High | Low | Better than localStorage |
| **HttpOnly Cookie** | High | Low | High | Best with CSRF protection |
| **Memory (state)** | High | Low | Low | Best for SPA, lost on refresh |

**Current Implementation:** Client-side storage (user's choice)

**Recommended:** HttpOnly cookies with CSRF tokens for production

### 4. HTTPS Requirement

⚠️ **Critical for Production:**
- Always use HTTPS in production
- Tokens sent over HTTP can be intercepted
- Use HSTS headers to enforce HTTPS

### 5. Rate Limiting

⚠️ **Not Implemented - Should Add:**
- Limit login attempts (e.g., 5 per 15 minutes)
- Prevent brute-force attacks
- Implement account lockout after failed attempts

Example implementation:
```javascript
// Use middleware like express-rate-limit
// Or implement custom rate limiting with Redis
```

### 6. Input Validation

✅ **Implemented:**
- Email format validation
- Password length validation
- Required field checks

⚠️ **Recommendations:**
- Use Zod for comprehensive validation
- Sanitize inputs to prevent SQL injection
- Validate all user inputs server-side

### 7. Error Messages

✅ **Implemented:**
- Generic "Invalid credentials" message (doesn't reveal if email exists)

⚠️ **Security Note:**
- Don't reveal whether email exists during login
- Use generic error messages to prevent enumeration attacks

## Environment Variables

Create a `.env.local` file in the `rurallite/` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rurallite"

# JWT Secret - CHANGE THIS IN PRODUCTION
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
```

**Generate a secure JWT secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Token Expiry and Refresh Strategy

### Current Implementation
- **Access Token Expiry**: 24 hours
- **No Refresh Token**: User must login again after expiry

### Recommended Production Strategy

**Option 1: Refresh Tokens**
- Short-lived access tokens (15 minutes - 1 hour)
- Long-lived refresh tokens (7-30 days)
- Refresh endpoint to get new access token

**Option 2: Sliding Expiration**
- Extend token expiry on each request
- Maximum session duration (e.g., 24 hours)

**Option 3: Remember Me**
- Separate long-lived token for "remember me" feature
- More restrictive permissions than regular session

## Common Issues and Solutions

### Issue: "Invalid token" error

**Solution:**
1. Check token hasn't expired (24 hours)
2. Verify Authorization header format: `Bearer <token>`
3. Ensure JWT_SECRET matches between token generation and verification

### Issue: Password validation fails

**Solution:**
1. Check password is at least 6 characters
2. Ensure password is included in request body
3. Verify no special character encoding issues

### Issue: User already exists (409)

**Solution:**
- Email must be unique
- Try different email or use login instead

## Future Enhancements

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Implement refresh token rotation
- [ ] Add two-factor authentication (2FA)
- [ ] Create admin panel for user management
- [ ] Add audit logging for authentication events
- [ ] Implement session management dashboard

## Resources

- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken Documentation](https://www.npmjs.com/package/jsonwebtoken)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT.io - Debugger and Introduction](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Implementation Date**: December 17, 2025
**Version**: 1.0.0
**Author**: TriVengers Team
