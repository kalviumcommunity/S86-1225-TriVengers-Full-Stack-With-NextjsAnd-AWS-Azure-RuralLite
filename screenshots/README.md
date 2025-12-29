# Screenshots Folder

This folder contains screenshots and visual documentation for the RuralLite project.

## Instructions

1. Run your app locally: `npm run dev`
2. Take a screenshot of the homepage running on localhost:3000
3. Save the screenshot as `local-dev-screenshot.png` in this folder
4. The screenshot will automatically be referenced in the main README.md

## Required Screenshots

### General
- **local-dev-screenshot.png** - Homepage running on localhost:3000 (Day 1 requirement)

### Security Headers (HTTPS Enforcement)
- **security-headers.png** - Browser DevTools showing Response Headers with all security headers (HSTS, CSP, X-Frame-Options, etc.)
- **security-scan.png** - Result from https://securityheaders.com showing A or A+ grade
- **cors-headers.png** - Browser DevTools showing CORS headers on API request (Access-Control-Allow-Origin, Access-Control-Allow-Methods, etc.)

## How to Capture Security Headers Screenshots

### 1. Security Headers in DevTools

1. Start your development server: `npm run dev`
2. Open http://localhost:3000 in Chrome
3. Open Chrome DevTools (F12)
4. Go to **Network** tab
5. Refresh the page
6. Click on the first request (usually "localhost" or the main document)
7. Click on **Headers** section
8. Scroll to **Response Headers**
9. Verify you see:
   - `Strict-Transport-Security`
   - `Content-Security-Policy`
   - `X-Frame-Options`
   - `X-Content-Type-Options`
   - `Referrer-Policy`
   - `Permissions-Policy`
10. Take a screenshot showing these headers
11. Save as `security-headers.png`

### 2. CORS Headers Test

1. In Chrome DevTools Network tab
2. Navigate to http://localhost:3000
3. Filter by "Fetch/XHR" or "API"
4. Click on any API request (e.g., `/api/testdb`)
5. Check **Response Headers** for:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`
6. Take a screenshot
7. Save as `cors-headers.png`

### 3. Online Security Scan

**After deploying to production:**

1. Visit https://securityheaders.com
2. Enter your deployed URL (e.g., https://rurallite.vercel.app)
3. Click "Scan"
4. Wait for results (target: A or A+ grade)
5. Take a screenshot of the results page
6. Save as `security-scan.png`

**Alternative tool:** https://observatory.mozilla.org

### 4. PowerShell Testing

You can also run the automated test script:

```powershell
.\test-security-headers.ps1
```

This will validate all headers and provide a detailed report in the terminal.

## Expected Results

All security headers should be present with appropriate values:
- ✓ HSTS with 2-year max-age
- ✓ CSP with restricted sources
- ✓ CORS with specific allowed origins
- ✓ X-Frame-Options set to DENY
- ✓ X-Content-Type-Options set to nosniff
- ✓ Referrer-Policy configured
- ✓ Permissions-Policy configured


