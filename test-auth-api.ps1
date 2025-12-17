# PowerShell script to test Authentication APIs
# Usage: .\test-auth-api.ps1

$BaseUrl = "http://localhost:3000/api"

# Test user data
$testUser = @{
    name     = "Alice Test"
    email    = "alice.test@example.com"
    password = "test123456"
    role     = "STUDENT"
}

$authToken = $null

# Helper function to make HTTP requests
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [string]$Token = $null
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        $params = @{
            Uri     = $Url
            Method  = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-WebRequest @params
        return @{
            Status = $response.StatusCode
            Data   = ($response.Content | ConvertFrom-Json)
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
        return @{
            Status = $statusCode
            Data   = $errorBody
        }
    }
}

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "🚀 Starting Authentication API Tests" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Signup
Write-Host ""
Write-Host "🧪 Test 1: User Signup" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Gray

$result = Invoke-ApiRequest -Url "$BaseUrl/auth/signup" -Method "POST" -Body $testUser
Write-Host "Status: $($result.Status)" -ForegroundColor Yellow
Write-Host "Response: $($result.Data | ConvertTo-Json -Depth 10)" -ForegroundColor White

if ($result.Status -eq 201 -or $result.Status -eq 409) {
    Write-Host "✅ Signup test passed" -ForegroundColor Green
}
else {
    Write-Host "❌ Signup test failed" -ForegroundColor Red
}

# Test 2: Login
Write-Host ""
Write-Host "🧪 Test 2: User Login" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Gray

$loginData = @{
    email    = $testUser.email
    password = $testUser.password
}

$result = Invoke-ApiRequest -Url "$BaseUrl/auth/login" -Method "POST" -Body $loginData
Write-Host "Status: $($result.Status)" -ForegroundColor Yellow
Write-Host "Response: $($result.Data | ConvertTo-Json -Depth 10)" -ForegroundColor White

if ($result.Status -eq 200 -and $result.Data.data.token) {
    $authToken = $result.Data.data.token
    Write-Host "[PASS] Login test passed" -ForegroundColor Green
    $tokenPreview = $authToken.Substring(0, 50)
    Write-Host "Token: $tokenPreview..." -ForegroundColor Cyan
}
else {
    Write-Host "[FAIL] Login test failed" -ForegroundColor Red
}

# Test 3: Get Current User Profile (Protected)
if ($authToken) {
    Write-Host ""
    Write-Host "🧪 Test 3: Get Current User Profile (Protected)" -ForegroundColor Green
    Write-Host ("=" * 50) -ForegroundColor Gray
    
    $result = Invoke-ApiRequest -Url "$BaseUrl/auth/me" -Method "GET" -Token $authToken
    Write-Host "Status: $($result.Status)" -ForegroundColor Yellow
    Write-Host "Response: $($result.Data | ConvertTo-Json -Depth 10)" -ForegroundColor White
    
    if ($result.Status -eq 200) {
        Write-Host "✅ Get profile test passed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Get profile test failed" -ForegroundColor Red
    }
}

# Test 4: Access Protected Route without Token
Write-Host ""
Write-Host "🧪 Test 4: Access Protected Route Without Token" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Gray

$result = Invoke-ApiRequest -Url "$BaseUrl/auth/me" -Method "GET"
Write-Host "Status: $($result.Status)" -ForegroundColor Yellow
Write-Host "Response: $($result.Data | ConvertTo-Json -Depth 10)" -ForegroundColor White

if ($result.Status -eq 401) {
    Write-Host "✅ Protected route correctly rejected unauthorized access" -ForegroundColor Green
}
else {
    Write-Host "❌ Protected route test failed - should return 401" -ForegroundColor Red
}

# Test 5: List Users (Protected)
if ($authToken) {
    Write-Host ""
    Write-Host "🧪 Test 5: List Users (Protected)" -ForegroundColor Green
    Write-Host ("=" * 50) -ForegroundColor Gray
    
    $result = Invoke-ApiRequest -Url "$BaseUrl/users" -Method "GET" -Token $authToken
    Write-Host "Status: $($result.Status)" -ForegroundColor Yellow
    Write-Host "Response: $($result.Data | ConvertTo-Json -Depth 10)" -ForegroundColor White
    
    if ($result.Status -eq 200) {
        Write-Host "✅ List users test passed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ List users test failed" -ForegroundColor Red
    }
}

# Test 6: Invalid Login Credentials
Write-Host ""
Write-Host "🧪 Test 6: Invalid Login Credentials" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Gray

$invalidLogin = @{
    email    = $testUser.email
    password = "wrongpassword"
}

$result = Invoke-ApiRequest -Url "$BaseUrl/auth/login" -Method "POST" -Body $invalidLogin
Write-Host "Status: $($result.Status)" -ForegroundColor Yellow
Write-Host "Response: $($result.Data | ConvertTo-Json -Depth 10)" -ForegroundColor White

if ($result.Status -eq 401) {
    Write-Host "✅ Invalid login test passed - correctly rejected" -ForegroundColor Green
}
else {
    Write-Host "❌ Invalid login test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "✅ All authentication tests completed!" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host ""
