# PowerShell script to test Authentication APIs
# Usage: .\test-auth-simple.ps1

$BaseUrl = "http://localhost:3000/api"

# Test user data
$testUser = @{
    name = "Alice Test"
    email = "alice.test@example.com"
    password = "test123456"
    role = "STUDENT"
}

Write-Host "`n==================================================`n" -ForegroundColor Cyan
Write-Host "Starting Authentication API Tests" -ForegroundColor Cyan
Write-Host "`n==================================================`n" -ForegroundColor Cyan

# Test 1: Signup
Write-Host "`n[TEST 1] User Signup" -ForegroundColor Green
Write-Host "=================================================="
try {
    $body = $testUser | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$BaseUrl/auth/signup" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "[PASS] Signup successful" -ForegroundColor Green
    Write-Host ($result | ConvertTo-Json -Depth 10)
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "[INFO] User already exists (409)" -ForegroundColor Yellow
    } else {
        Write-Host "[FAIL] Signup failed: $_" -ForegroundColor Red
    }
}

# Test 2: Login
Write-Host "`n[TEST 2] User Login" -ForegroundColor Green
Write-Host "=================================================="
try {
    $loginData = @{
        email = $testUser.email
        password = $testUser.password
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    $token = $result.data.token
    Write-Host "[PASS] Login successful" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host ($result | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "[FAIL] Login failed: $_" -ForegroundColor Red
    $token = $null
}

# Test 3: Get Current User Profile (Protected)
if ($token) {
    Write-Host "`n[TEST 3] Get Current User Profile (Protected)" -ForegroundColor Green
    Write-Host "=================================================="
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        $result = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method GET -Headers $headers -ContentType "application/json" -ErrorAction Stop
        Write-Host "[PASS] Profile fetched successfully" -ForegroundColor Green
        Write-Host ($result | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "[FAIL] Failed to fetch profile: $_" -ForegroundColor Red
    }
}

# Test 4: Access Protected Route without Token
Write-Host "`n[TEST 4] Access Protected Route Without Token" -ForegroundColor Green
Write-Host "=================================================="
try {
    $result = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method GET -ContentType "application/json" -ErrorAction Stop
    Write-Host "[FAIL] Should have been rejected (401)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "[PASS] Correctly rejected unauthorized access (401)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Unexpected error: $_" -ForegroundColor Red
    }
}

# Test 5: List Users (Protected)
if ($token) {
    Write-Host "`n[TEST 5] List Users (Protected)" -ForegroundColor Green
    Write-Host "=================================================="
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        $result = Invoke-RestMethod -Uri "$BaseUrl/users" -Method GET -Headers $headers -ContentType "application/json" -ErrorAction Stop
        Write-Host "[PASS] Users listed successfully" -ForegroundColor Green
        Write-Host "Total users: $($result.meta.total)" -ForegroundColor Cyan
    } catch {
        Write-Host "[FAIL] Failed to list users: $_" -ForegroundColor Red
    }
}

# Test 6: Invalid Login Credentials
Write-Host "`n[TEST 6] Invalid Login Credentials" -ForegroundColor Green
Write-Host "=================================================="
try {
    $invalidLogin = @{
        email = $testUser.email
        password = "wrongpassword"
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method POST -Body $invalidLogin -ContentType "application/json" -ErrorAction Stop
    Write-Host "[FAIL] Should have been rejected" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "[PASS] Correctly rejected invalid credentials (401)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host "`n==================================================`n" -ForegroundColor Cyan
Write-Host "All authentication tests completed!" -ForegroundColor Cyan
Write-Host "`n==================================================`n" -ForegroundColor Cyan
