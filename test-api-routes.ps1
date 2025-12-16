# API Routes Testing Script
# Tests all API endpoints in the RuralLite application

Write-Host "🧪 Testing RuralLite API Routes" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"
$endpoints = @(
    "/api/testdb",
    "/api/users",
    "/api/lessons",
    "/api/quizzes",
    "/api/progress",
    "/api/quiz-results",
    "/api/notes"
)

$results = @()

foreach ($endpoint in $endpoints) {
    $url = "$baseUrl$endpoint"
    Write-Host "Testing: $endpoint" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        $content = $response.Content | ConvertFrom-Json
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Status: 200 OK" -ForegroundColor Green
            
            if ($content.success) {
                Write-Host "  ✓ Success: true" -ForegroundColor Green
                
                if ($content.count -ne $null) {
                    Write-Host "  ✓ Count: $($content.count)" -ForegroundColor Green
                }
                elseif ($content.counts -ne $null) {
                    Write-Host "  ✓ Counts:" -ForegroundColor Green
                    $content.counts | Format-List | Out-String | ForEach-Object { 
                        $_.Trim() -split "`n" | ForEach-Object { 
                            if ($_.Trim()) { Write-Host "    $_" -ForegroundColor Gray }
                        }
                    }
                }
                
                $results += [PSCustomObject]@{
                    Endpoint = $endpoint
                    Status = "✓ PASS"
                    StatusCode = 200
                }
            }
            else {
                Write-Host "  ✗ Success: false" -ForegroundColor Red
                Write-Host "  ✗ Error: $($content.error)" -ForegroundColor Red
                
                $results += [PSCustomObject]@{
                    Endpoint = $endpoint
                    Status = "✗ FAIL"
                    StatusCode = 200
                }
            }
        }
        else {
            Write-Host "  ✗ Status: $($response.StatusCode)" -ForegroundColor Red
            $results += [PSCustomObject]@{
                Endpoint = $endpoint
                Status = "✗ FAIL"
                StatusCode = $response.StatusCode
            }
        }
    }
    catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        $results += [PSCustomObject]@{
            Endpoint = $endpoint
            Status = "✗ ERROR"
            StatusCode = "N/A"
        }
    }
    
    Write-Host ""
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$results | Format-Table -AutoSize

$passCount = ($results | Where-Object { $_.Status -eq "✓ PASS" }).Count
$totalCount = $results.Count
$passRate = [math]::Round(($passCount / $totalCount) * 100, 2)

Write-Host "`nTotal Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $($totalCount - $passCount)" -ForegroundColor Red
Write-Host "Pass Rate: $passRate%`n" -ForegroundColor $(if ($passRate -eq 100) { "Green" } else { "Yellow" })

if ($passRate -eq 100) {
    Write-Host "🎉 All API routes are working correctly!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Some API routes failed. Please check the errors above." -ForegroundColor Yellow
}
