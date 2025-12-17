# Authentication API - Quick Reference

## 🚀 Quick Start Guide

### Base URL
```
http://localhost:3000/api
```

---

## 1️⃣ Sign Up (Register New User)

### Request
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Alice Test",
  "email": "alice@example.com",
  "password": "mypassword123",
  "role": "STUDENT"
}
```

### Response (201 Created)
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
  }
}
```

### cURL Command
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Test","email":"alice@example.com","password":"mypassword123"}'
```

### PowerShell Command
```powershell
$body = @{
    name = "Alice Test"
    email = "alice@example.com"
    password = "mypassword123"
    role = "STUDENT"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

## 2️⃣ Log In (Get JWT Token)

### Request
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzAyODE2ODAwLCJleHAiOjE3MDI5MDMyMDB9.xyz...",
    "user": {
      "id": 1,
      "name": "Alice Test",
      "email": "alice@example.com",
      "role": "STUDENT"
    }
  }
}
```

### cURL Command
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"mypassword123"}'
```

### PowerShell Command
```powershell
$loginData = @{
    email = "alice@example.com"
    password = "mypassword123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -Body $loginData `
    -ContentType "application/json"

# Save token for later use
$token = $response.data.token
Write-Host "Token: $token"
```

---

## 3️⃣ Get Current User Profile (Protected)

### Request
```bash
GET /api/auth/me
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### Response (200 OK)
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
  }
}
```

### cURL Command
```bash
# Replace YOUR_TOKEN with actual token from login
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### PowerShell Command
```powershell
# Using token from previous login
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
    -Method GET `
    -Headers $headers `
    -ContentType "application/json"
```

---

## 4️⃣ List Users (Protected)

### Request
```bash
GET /api/users?page=1&limit=10
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### Response (200 OK)
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

### cURL Command
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### PowerShell Command
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users?page=1&limit=10" `
    -Method GET `
    -Headers $headers `
    -ContentType "application/json"
```

---

## 🔥 Complete Workflow Example (PowerShell)

```powershell
# 1. Sign Up
$signupData = @{
    name = "Bob Smith"
    email = "bob@example.com"
    password = "secure123"
    role = "STUDENT"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" `
        -Method POST -Body $signupData -ContentType "application/json"
    Write-Host "✅ Signup successful!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ User may already exist" -ForegroundColor Yellow
}

# 2. Log In
$loginData = @{
    email = "bob@example.com"
    password = "secure123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST -Body $loginData -ContentType "application/json"

$token = $loginResponse.data.token
Write-Host "✅ Login successful! Token received." -ForegroundColor Green

# 3. Get Profile
$headers = @{ Authorization = "Bearer $token" }

$profile = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
    -Method GET -Headers $headers -ContentType "application/json"

Write-Host "👤 User Profile:" -ForegroundColor Cyan
Write-Host ($profile | ConvertTo-Json -Depth 10)

# 4. List Users
$users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
    -Method GET -Headers $headers -ContentType "application/json"

Write-Host "📋 All Users:" -ForegroundColor Cyan
Write-Host ($users | ConvertTo-Json -Depth 10)
```

---

## ❌ Common Error Responses

### 400 - Validation Error
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

### 401 - Unauthorized (Invalid Credentials)
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

### 401 - Unauthorized (Missing/Invalid Token)
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

### 409 - Conflict (Duplicate Email)
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

---

## 🧪 Testing with Postman

### 1. Create New Collection
- Name: "RuralLite Authentication"

### 2. Add Environment Variables
- `baseUrl`: `http://localhost:3000/api`
- `token`: (will be set automatically)

### 3. Create Requests

#### Signup Request
- **Name**: Signup
- **Method**: POST
- **URL**: `{{baseUrl}}/auth/signup`
- **Body** (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456"
}
```

#### Login Request
- **Name**: Login
- **Method**: POST
- **URL**: `{{baseUrl}}/auth/login`
- **Body** (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "test123456"
}
```
- **Tests** (to save token):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

#### Get Profile Request
- **Name**: Get Profile
- **Method**: GET
- **URL**: `{{baseUrl}}/auth/me`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`

---

## 📝 Notes

- **Token Expiry**: Tokens expire after 24 hours
- **Password Requirements**: Minimum 6 characters
- **Email Validation**: Must be valid email format
- **Default Role**: STUDENT (if not specified)
- **Available Roles**: STUDENT, TEACHER, ADMIN

---

## 🔗 Related Documentation

- [Complete Authentication Guide](./AUTHENTICATION_README.md)
- [Implementation Summary](./AUTHENTICATION_IMPLEMENTATION_SUMMARY.md)
- [Main README](./README.md)

---

**Last Updated**: December 17, 2025
