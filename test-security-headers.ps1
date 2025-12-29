# Security Headers Testing Script
# Tests HTTPS enforcement, security headers, and CORS configuration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Security Headers and CORS Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3000"
$apiUrl = "$baseUrl/api/testdb"

# Test 1: Check if server is running
Write-Host "Test 1: Checking if server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK] Server is running" -ForegroundColor Green
}
catch {
    Write-Host "[FAIL] Server is not running. Please start the server with 'npm run dev'" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Security Headers on Main Page
Write-Host "Test 2: Checking Security Headers on Main Page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing
    $headers = $response.Headers
    
    $securityHeaders = @{
        "Strict-Transport-Security" = "HSTS (HTTP Strict Transport Security)"
        "Content-Security-Policy"   = "CSP (Content Security Policy)"
        "X-Frame-Options"           = "X-Frame-Options"
        "X-Content-Type-Options"    = "X-Content-Type-Options"
        "Referrer-Policy"           = "Referrer Policy"
        "Permissions-Policy"        = "Permissions Policy"
    }
    
    Write-Host "`nSecurity Headers Found:" -ForegroundColor Cyan
    Write-Host "------------------------" -ForegroundColor Cyan
    
    foreach ($header in $securityHeaders.Keys) {
        if ($headers.ContainsKey($header)) {
            $value = $headers[$header]
            Write-Host "[OK] $($securityHeaders[$header])" -ForegroundColor Green
            Write-Host "  Header: $header" -ForegroundColor Gray
            Write-Host "  Value: $value" -ForegroundColor Gray
            Write-Host ""
        }
        else {
            Write-Host "[FAIL] $($securityHeaders[$header]) - NOT FOUND" -ForegroundColor Red
            Write-Host ""
        }
    }
}
catch {
    Write-Host "[FAIL] Failed to fetch headers" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: CORS Headers on API Route
Write-Host "Test 3: Checking CORS Headers on API Route..." -ForegroundColor Yellow
try {
    # Send request with Origin header to trigger CORS
    $apiResponse = Invoke-WebRequest -Uri $apiUrl `
        -Method GET `
        -Headers @{
        "Origin" = "http://localhost:3000"
    } `
        -UseBasicParsing
    
    $apiHeaders = $apiResponse.Headers
    
    Write-Host "`nCORS Headers Found:" -ForegroundColor Cyan
    Write-Host "-------------------" -ForegroundColor Cyan
    
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials"
    )
    
    foreach ($header in $corsHeaders) {
        if ($apiHeaders.ContainsKey($header)) {
            $value = $apiHeaders[$header]
            Write-Host "[OK] $header" -ForegroundColor Green
            Write-Host "  Value: $value" -ForegroundColor Gray
            Write-Host ""
        }
        else {
            Write-Host "[FAIL] $header - NOT FOUND" -ForegroundColor Red
            Write-Host ""
        }
    }
}
catch {
    Write-Host "[FAIL] Failed to test CORS headers" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Preflight OPTIONS Request
Write-Host "Test 4: Testing Preflight OPTIONS Request..." -ForegroundColor Yellow
try {
    $optionsResponse = Invoke-WebRequest -Uri $apiUrl `
        -Method OPTIONS `
        -Headers @{
        "Origin"                         = "http://localhost:3000"
        "Access-Control-Request-Method"  = "POST"
        "Access-Control-Request-Headers" = "Content-Type,Authorization"
    } `
        -UseBasicParsing
    
    if ($optionsResponse.StatusCode -eq 204) {
        Write-Host "[OK] Preflight request successful (Status: 204)" -ForegroundColor Green
        
        $optionsHeaders = $optionsResponse.Headers
        if ($optionsHeaders.ContainsKey("Access-Control-Allow-Origin")) {
            Write-Host "[OK] CORS preflight response includes Access-Control-Allow-Origin" -ForegroundColor Green
        }
        if ($optionsHeaders.ContainsKey("Access-Control-Allow-Methods")) {
            Write-Host "[OK] CORS preflight response includes Access-Control-Allow-Methods" -ForegroundColor Green
        }
    }
    else {
        Write-Host "[WARN] Preflight request returned status: $($optionsResponse.StatusCode)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[FAIL] Preflight request failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: CSP Validation
Write-Host "Test 5: Validating Content Security Policy..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing
    if ($response.Headers.ContainsKey("Content-Security-Policy")) {
        $csp = $response.Headers["Content-Security-Policy"]
        
        # Check for key directives
        $keyDirectives = @(
            "default-src",
            "script-src",
            "style-src",
            "img-src",
            "frame-ancestors",
            "upgrade-insecure-requests"
        )
        
        Write-Host "`nCSP Directives Check:" -ForegroundColor Cyan
        Write-Host "---------------------" -ForegroundColor Cyan
        
        foreach ($directive in $keyDirectives) {
            if ($csp -match $directive) {
                Write-Host "[OK] $directive present" -ForegroundColor Green
            }
            else {
                Write-Host "[WARN] $directive missing" -ForegroundColor Yellow
            }
        }
        
        # Check for potentially insecure values
        if ($csp -match "'unsafe-inline'") {
            Write-Host "`n[WARN] Warning: CSP contains 'unsafe-inline' - consider using nonces/hashes" -ForegroundColor Yellow
        }
        if ($csp -match "'unsafe-eval'") {
            Write-Host "[WARN] Warning: CSP contains 'unsafe-eval' - consider removing if possible" -ForegroundColor Yellow
        }
    }
}
catch {
    Write-Host "[FAIL] Failed to validate CSP" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review the results above" -ForegroundColor White
Write-Host "2. Take screenshots using Chrome DevTools:" -ForegroundColor White
Write-Host "   - Open DevTools, Network tab, Select request, then Headers" -ForegroundColor Gray
Write-Host "3. Test online with:" -ForegroundColor White
Write-Host "   - https://securityheaders.com" -ForegroundColor Gray
Write-Host "   - https://observatory.mozilla.org" -ForegroundColor Gray
Write-Host "4. Update ALLOWED_ORIGINS in lib/corsConfig.js for production" -ForegroundColor White
Write-Host "5. Customize CSP based on your third-party integrations" -ForegroundColor White
Write-Host ""

