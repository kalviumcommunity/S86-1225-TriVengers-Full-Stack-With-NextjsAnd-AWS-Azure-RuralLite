# 📘 RuralLite Learning Platform

### Offline-First Educational Web App for Low-Bandwidth Rural Schools

Built with Next.js, **AWS/Azure Cloud Services**, and **Progressive Web App (PWA)** technologies.

---

## 📌 Problem Statement

Rural and low-connectivity schools struggle to access quality educational resources due to poor internet infrastructure. Students often miss out on digital learning opportunities, multimedia content, and interactive assessments that urban schools enjoy. RuralLite addresses this gap by providing an offline-first learning platform that works seamlessly without internet, while syncing progress when connectivity is available.

---

## 🎯 Overview

RuralLite is a lightweight, offline-first learning platform designed for rural or low-connectivity schools.

The application allows students to access lessons, quizzes, and multimedia resources fully offline, using a PWA architecture with smart caching, local storage, and background synchronization. Cloud services (AWS or Azure) are used only for authentication, content publishing, and occasional data sync.

---

## 🎯 Key Features

- Offline-first PWA (works without internet)
- Local caching of lessons, quizzes, notes, and media
- Lightweight content bundles optimized for weak networks
- Background sync for student progress & new content
- Teacher-friendly CMS (cloud-hosted)
- Low-end device compatible
- **Secure user authentication with bcrypt and JWT** ([See Authentication Documentation](./AUTHENTICATION_README.md))
- **Secure file uploads with AWS S3 pre-signed URLs**

---

## 🏗 System Architecture

┌──────────────────────────┐
│ Next.js PWA Frontend │
│ (Service Worker, SWR) │
│ │
│ • IndexedDB (offline) │
│ • LocalForage caching │
│ • Background Sync │
└──────────────┬───────────┘
│ occasional sync
┌──────────────▼─────────────┐
│ Cloud Backend (API) │
│ AWS Lambda / Azure Func. │
│ │
│ • Content APIs │
│ • Sync endpoints │
│ • Authentication │
└──────────────┬─────────────┘
│
┌──────────────▼─────────────┐
│ Content Storage + CDN │
│ S3/Blob + CloudFront/CDN │
│ │
│ • Lesson bundles │
│ • Multimedia assets │
└─────────────────────────────┘

---

## 🧰 Tech Stack

> NOTE: A Prisma + PostgreSQL schema is included in `prisma/` for normalized relational data modelling (User/Team/Project/Task). See `prisma/README.md` for migration and seed steps.

- **Frontend**: Next.js (React Framework)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Cloud Services**: AWS (S3 for file storage, Lambda, Cognito)
- **File Upload**: AWS SDK v3 with pre-signed URLs
- **Authentication**: bcrypt + JWT
- **Caching**: Redis (ioredis)
- **Styling**: Tailwind CSS
- **Deployment**: AWS / Vercel

---

## 📁 Project Structure

```
S86-1225-TriVengers-Full-Stack-With-NextjsAnd-AWS-Azure-RuralLite/
├── rurallite/                      # Main Next.js application
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authentication routes (login, register)
│   │   ├── dashboard/              # Student/Teacher dashboard pages
│   │   ├── lessons/                # Lesson listing and detail pages
│   │   │   └── [id]/               # Dynamic route for individual lessons
│   │   ├── quizzes/                # Quiz pages and quiz results
│   │   │   └── [id]/               # Dynamic route for individual quizzes
│   │   ├── notes/                  # Student notes section
│   │   ├── api/                    # Backend API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── lessons/            # Lesson CRUD operations
│   │   │   ├── quizzes/            # Quiz endpoints
│   │   │   ├── upload/             # File upload with pre-signed URLs
│   │   │   ├── files/              # File metadata management
│   │   │   └── sync/               # Background sync endpoints
│   │   ├── globals.css             # Global styles
│   │   ├── layout.js               # Root layout component
│   │   └── page.js                 # Homepage (Hero section)
│   ├── components/                 # Reusable React components
│   │   ├── ui/                     # UI components (Button, Card, Navigation)
│   │   ├── lessons/                # Lesson-specific components
│   │   ├── offline/                # Offline indicator & sync status
│   │   └── FileUploader.jsx        # File upload component with S3
│   ├── lib/                        # Utility libraries and helpers
│   │   ├── aws-s3.js               # AWS S3 pre-signed URL configuration
│   │   ├── db/                     # IndexedDB configuration and operations
│   │   ├── pwa/                    # Service Worker and sync manager
│   │   └── utils/                  # Helper functions and utilities
│   ├── public/                     # Static assets
│   │   ├── icons/                  # App icons for PWA
│   │   ├── manifest.json           # PWA manifest file
│   │   └── sw.js                   # Service Worker script
│   ├── styles/                     # Additional stylesheets
│   ├── config/                     # Configuration files
│   ├── package.json                # Dependencies and scripts
│   ├── next.config.mjs             # Next.js configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   └── eslint.config.mjs           # ESLint configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation (this file)
```

### 📂 Folder Purpose Explanation

| Folder/File     | Purpose                                                              |
| --------------- | -------------------------------------------------------------------- |
| **app/**        | Contains all pages and routing logic using Next.js App Router        |
| **app/(auth)/** | Groups authentication-related pages (login, register)                |
| **app/api/**    | Backend API endpoints for authentication, lessons, quizzes, and sync |
| **components/** | Reusable UI components to maintain DRY principle                     |
| **lib/**        | Business logic, database operations, PWA utilities                   |
| **lib/db/**     | IndexedDB wrapper for offline data storage                           |
| **lib/pwa/**    | Service Worker registration and background sync logic                |
| **public/**     | Static assets served directly (icons, manifest, service worker)      |
| **config/**     | Application configuration files (API keys, constants)                |

### 🏗️ Naming Conventions

- **Files**: kebab-case (e.g., `lesson-card.js`, `auth-provider.js`)
- **Components**: PascalCase (e.g., `LessonCard`, `OfflineIndicator`)
- **API Routes**: RESTful naming (e.g., `/api/lessons`, `/api/quizzes/[id]`)
- **Folders**: lowercase with hyphens for multi-word names

---

## 🚀 Quick Start (Dev)

Run the app from the `rurallite` folder (not the repo root).

```bash
cd rurallite
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

If you see an error like "missing script: dev" or Exit Code 1 when running from the repo root, you're in the wrong folder. Switch to `rurallite/` first.

---

## 🛠 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (local via Docker or a cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kalviumcommunity/S86-1225-TriVengers-Full-Stack-With-NextjsAnd-AWS-Azure-RuralLite.git
   cd S86-1225-TriVengers-Full-Stack-With-NextjsAnd-AWS-Azure-RuralLite/rurallite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `rurallite/` directory:

```env
# Required
DATABASE_URL=postgresql://postgres:password@localhost:5432/rurallite
JWT_SECRET=replace_with_a_strong_secret

# Optional: Email Providers
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_SENDER=no-reply@yourdomain.com
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
SES_EMAIL_SENDER=no-reply@yourdomain.com
EMAIL_PROVIDER=sendgrid # or ses
```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📸 Local Development Screenshot

![RuralLite Homepage Running Locally](./screenshots/local-dev-screenshot.png)

_Screenshot showing the RuralLite homepage running on localhost:3000_

---

## 🧩 Troubleshooting

- Missing `dev` script / Exit Code 1 when running `npm run dev` at repo root:
  - Run commands inside `rurallite/` (`cd rurallite`), then `npm run dev`.
- Database connection errors:
  - Ensure PostgreSQL is running and `DATABASE_URL` is correct in `rurallite/.env.local`.
- Unauthorized or login redirect loops:
  - Ensure `JWT_SECRET` is set in `rurallite/.env.local`. Log in via `/login` to set the auth cookie.

---

## 💡 Why This Structure?

### Scalability

- **Modular Design**: Components, API routes, and utilities are separated for easy maintenance
- **Feature-Based Organization**: Related features (lessons, quizzes) are grouped together
- **Reusable Components**: UI components can be shared across different pages
- **API Separation**: Backend logic is isolated in `app/api/` for easy testing and scaling

### Clarity

- **Clear Separation of Concerns**: Frontend (components), Backend (API), and utilities (lib) are distinct
- **Intuitive Navigation**: Folder names clearly indicate their purpose
- **Grouped Routes**: Using `(auth)` groups keeps authentication logic together without affecting URLs

### Team Collaboration

- **Easy Onboarding**: New team members can quickly understand the project structure
- **Parallel Development**: Multiple developers can work on different features without conflicts
- **Consistent Patterns**: Naming conventions ensure uniformity across the codebase

### Future Sprints

- **PWA Support**: `lib/pwa/` folder is ready for service worker and offline capabilities
- **Database Flexibility**: `lib/db/` can be extended for different database solutions
- **Component Library**: `components/ui/` can evolve into a full design system
- **API Versioning**: API routes can be versioned (`api/v1/`, `api/v2/`) as needed

---

---

## 🗄️ Prisma ORM Setup

### Why Prisma?

Prisma is our chosen ORM for RuralLite because it provides:

- **Type Safety**: Auto-generated TypeScript types prevent runtime errors
- **PostgreSQL Support**: Robust relational database for complex queries and data integrity
- **Developer Experience**: Intuitive API and excellent tooling
- **Query Optimization**: Efficient queries crucial for low-bandwidth environments
- **Migration Management**: Version control for database schema changes

### Database Models

Our schema is designed specifically for offline-first rural education:

#### Core Models:

- **User**: Students, Teachers, and Admins with role-based access
- **Lesson**: Educational content with offline caching metadata (download size, media URLs)
- **Quiz**: Assessments with time limits and configurable passing scores
- **Question**: Individual quiz questions with multiple choice options
- **QuizResult**: Student attempts with sync tracking for offline-to-online transition
- **Answer**: Individual answer records linked to quiz results
- **Progress**: Lesson completion tracking with percentage and sync status
- **Note**: Student notes with tag support and offline sync capability

#### Key Design Decisions:

- **PostgreSQL**: Relational integrity, ACID compliance, and powerful querying
- **Separate Tables**: Question and Answer are separate tables (not embedded) for flexibility
- **Sync Tracking**: `syncedAt` fields track offline-to-cloud synchronization
- **Cascade Deletes**: Maintains data integrity when users/lessons are removed
- **Indexes**: Optimized queries on foreign keys and frequently searched fields
- **Unique Constraints**: Prevents duplicate progress entries per user-lesson

### Schema Snippet

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Lesson {
  id          Int       @id @default(autoincrement())
  title       String
  subject     String
  grade       Int
  difficulty  Difficulty @default(BEGINNER)
  isOffline   Boolean   @default(true)
  downloadSize Int?     // KB for offline planning

  quizzes     Quiz[]
  progress    Progress[]
}

model Progress {
  id          Int       @id @default(autoincrement())
  userId      Int
  lessonId    Int
  completed   Boolean   @default(false)
  progress    Int       @default(0)
  syncedAt    DateTime? // Tracks cloud sync

  user        User      @relation(fields: [userId], references: [id])
  lesson      Lesson    @relation(fields: [lessonId], references: [id])

  @@unique([userId, lessonId])
  @@index([userId])
}
```

### Setup Steps

1. **Install Prisma**

   ```bash
   cd rurallite
   npm install prisma @prisma/client --save-dev
   npx prisma init
   ```

2. **Configure Database**
   - Update `DATABASE_URL` in `.env.local` with MongoDB connection string
   - Use `.env.example` as reference

3. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

4. **Push Schema to Database**

   ```bash
   npx prisma db push
   ```

5. **Test Connection**
   ```typescript
   import { prisma } from "@/lib/prisma";
   const users = await prisma.user.findMany();
   ```

### Client Initialization

Created singleton Prisma client at `lib/prisma.js`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Why Singleton?** Prevents multiple Prisma instances during development hot-reloading, avoiding database connection exhaustion.

### Testing & Verification

Test queries available in `lib/db/test-connection.js`:

- Connection verification
- Sample lesson creation
- Query examples for all models

### How Prisma Improves Our Project

**Type Safety**: Auto-completion for all database queries eliminates typos and wrong field names
**Productivity**: No manual SQL writing—focus on features, not queries  
**Data Integrity**: PostgreSQL's relational constraints ensure consistent data relationships  
**Team Collaboration**: Shared schema file ensures everyone uses same data structure  
**Reliability**: Built-in connection pooling and query optimization crucial for low-resource environments
**Migrations**: Version-controlled database changes make team collaboration seamless

### Environment Variables

```env
# PostgreSQL Connection (Local)
DATABASE_URL="postgresql://postgres:password@localhost:5432/rurallite"

# PostgreSQL Connection (Production - example)
DATABASE_URL="postgresql://user:password@host.com:5432/rurallite?schema=public"
```

See `.env.example` for complete configuration.

---

## 🔑 Authentication & Authorization

RuralLite implements a secure authentication system using industry-standard practices:

### Features

- **Password Hashing**: bcrypt with 10 salt rounds ensures passwords are never stored in plain text
- **JWT Tokens**: JSON Web Tokens for stateless session management
- **Protected Routes**: Middleware-based authentication for API endpoints
- **Role-Based Access**: Support for STUDENT, TEACHER, and ADMIN roles
- **Token Expiry**: 24-hour token lifetime with automatic expiration

### API Endpoints

| Endpoint           | Method | Description                   | Auth Required |
| ------------------ | ------ | ----------------------------- | ------------- |
| `/api/auth/signup` | POST   | Register new user             | ❌            |
| `/api/auth/login`  | POST   | Authenticate user & get token | ❌            |
| `/api/auth/me`     | GET    | Get current user profile      | ✅            |
| `/api/users`       | GET    | List all users (paginated)    | ✅            |

### Quick Start

**1. Signup:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"test123"}'
```

**2. Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"test123"}'
```

**3. Access Protected Route:**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Environment Variables

Add to your `.env.local`:

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

**Generate a secure secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Testing

Use the provided test scripts:

```powershell
# Start server
cd rurallite
npm run dev

# Run tests (in another terminal)
.\test-auth-simple.ps1
```

### Security Highlights

✅ Bcrypt hashing prevents password leaks  
✅ JWT tokens enable stateless authentication  
✅ Protected routes validate tokens  
✅ Generic error messages prevent user enumeration  
✅ Input validation prevents injection attacks

### Complete Documentation

For detailed authentication implementation, API examples, security considerations, and best practices, see:

📚 **[Complete Authentication Documentation](./AUTHENTICATION_README.md)**

---

## 📤 File Upload with AWS S3

RuralLite implements secure file uploads using **AWS S3 pre-signed URLs**, allowing students and teachers to upload documents, images, and learning materials directly to cloud storage without exposing credentials.

### Key Features

- **Pre-signed URLs**: Temporary upload URLs (60s expiry) for direct S3 uploads
- **File Validation**: Type and size checks (10MB max)
- **Secure Storage**: AWS credentials protected, never exposed to client
- **Metadata Tracking**: File information stored in PostgreSQL
- **Direct Upload**: Clients upload to S3 directly, bypassing backend bottlenecks

### Supported File Types

Images (`.jpg`, `.png`, `.gif`, `.webp`), Documents (`.pdf`, `.doc`, `.docx`, `.txt`)

### Upload Flow

```
Client → Backend (generates URL) → S3 (direct upload) → Database (stores metadata)
```

### API Endpoints

- `POST /api/upload` - Generate pre-signed URL
- `POST /api/files` - Store file metadata
- `GET /api/files` - Retrieve uploaded files
- `DELETE /api/files` - Delete file from S3 and database

### Quick Test

```bash
# Test upload flow
.\test-file-upload.ps1
```

For complete file upload documentation, architecture details, security measures, and setup guide, see:

📚 **[Complete File Upload Documentation](./FILE_UPLOAD_README.md)**  
📚 **[Quick Setup Guide](./SETUP_GUIDE.md)**

---

## 🔒 HTTPS Enforcement & Secure Headers

RuralLite implements comprehensive security headers to protect against common web vulnerabilities. These headers act as the first line of defense against attacks like man-in-the-middle (MITM), cross-site scripting (XSS), clickjacking, and unauthorized API access.

### Security Headers Overview

| Header | Purpose | Attack Prevention |
|--------|---------|------------------|
| **HSTS** (HTTP Strict Transport Security) | Forces browsers to always use HTTPS | Man-in-the-middle (MITM) attacks, protocol downgrade |
| **CSP** (Content Security Policy) | Restricts allowed sources for scripts, styles, and content | Cross-Site Scripting (XSS), data exfiltration |
| **CORS** (Cross-Origin Resource Sharing) | Controls which domains can access your API | Unauthorized API access from untrusted domains |
| **X-Frame-Options** | Prevents page from being embedded in iframes | Clickjacking attacks |
| **X-Content-Type-Options** | Prevents MIME type sniffing | Drive-by downloads, content type attacks |
| **Referrer-Policy** | Controls referrer information sent with requests | Information leakage |

### Implementation Details

#### 1. HSTS (HTTP Strict Transport Security)

Configured in [rurallite/next.config.mjs](rurallite/next.config.mjs):

```javascript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

**Configuration breakdown:**
- `max-age=63072000` → 2 years validity (730 days)
- `includeSubDomains` → Applies to all subdomains
- `preload` → Eligible for HSTS preload list in browsers

**What it does:** Once a user visits your site over HTTPS, their browser will automatically use HTTPS for all future requests for 2 years, even if they type `http://` in the address bar.

#### 2. Content Security Policy (CSP)

Configured in [rurallite/next.config.mjs](rurallite/next.config.mjs):

```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com; ..."
}
```

**Key directives:**
- `default-src 'self'` → Only load resources from same origin by default
- `script-src` → Defines allowed JavaScript sources (self, Google APIs)
- `style-src` → Defines allowed CSS sources (self, inline styles, Google Fonts)
- `img-src 'self' data: https: blob:` → Allow images from self, data URIs, HTTPS, and blobs
- `connect-src` → Restricts AJAX, WebSocket, and fetch() destinations
- `frame-ancestors 'none'` → Prevents embedding in iframes (alternative to X-Frame-Options)
- `upgrade-insecure-requests` → Automatically upgrades HTTP requests to HTTPS

**⚠️ Important:** Customize CSP based on your actual third-party integrations (analytics, fonts, CDNs). A strict CSP can break functionality if not configured properly.

#### 3. CORS (Cross-Origin Resource Sharing)

Configured in [rurallite/lib/corsConfig.js](rurallite/lib/corsConfig.js) and applied via [rurallite/middleware.js](rurallite/middleware.js):

```javascript
// Allowed origins (customize for your deployment)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://rurallite.vercel.app',
  'https://your-production-domain.com'
];
```

**CORS Headers:**
- `Access-Control-Allow-Origin` → Specifies exact allowed origin (never use `*` in production)
- `Access-Control-Allow-Methods` → `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers` → `Content-Type, Authorization, X-Requested-With`
- `Access-Control-Allow-Credentials` → `true` (allows cookies/auth headers)
- `Access-Control-Max-Age` → `86400` (24 hours cache for preflight requests)

**How it works:**
1. Browser sends preflight OPTIONS request with `Origin` header
2. Middleware checks if origin is in allowed list
3. If allowed, responds with CORS headers; if not, request is blocked
4. Actual request proceeds only if preflight succeeds

**Development vs Production:**
- **Development:** All localhost origins are automatically allowed
- **Production:** Only explicitly listed domains in `ALLOWED_ORIGINS` are allowed

#### 4. Additional Security Headers

**X-Frame-Options:**
```javascript
{ key: 'X-Frame-Options', value: 'DENY' }
```
Prevents the page from being embedded in any iframe, protecting against clickjacking.

**X-Content-Type-Options:**
```javascript
{ key: 'X-Content-Type-Options', value: 'nosniff' }
```
Forces browsers to respect declared content types, preventing MIME-type sniffing attacks.

**Referrer-Policy:**
```javascript
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
```
Sends full URL for same-origin requests, only origin for cross-origin requests.

**Permissions-Policy:**
```javascript
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
```
Disables browser features like camera, microphone, and geolocation for added privacy.

### Testing & Verification

#### Local Testing (Chrome DevTools)

1. Open your app in Chrome
2. Open DevTools → **Network** tab
3. Refresh the page and select the main document request
4. Click **Headers** → **Response Headers**
5. Verify presence of:
   - `Strict-Transport-Security`
   - `Content-Security-Policy`
   - `X-Frame-Options`
   - `X-Content-Type-Options`
   - `Access-Control-Allow-Origin` (on API requests)

#### Online Security Scanners

Test your deployed application with these tools:

**[Security Headers](https://securityheaders.com)**
```
https://securityheaders.com/?q=https://your-domain.com
```
Provides a grade (A+ to F) and detailed analysis of all security headers.

**[Mozilla Observatory](https://observatory.mozilla.org)**
```
https://observatory.mozilla.org/analyze/your-domain.com
```
Comprehensive security scan including headers, TLS configuration, and best practices.

**[SSL Labs](https://www.ssllabs.com/ssltest/)**
```
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```
Tests HTTPS/TLS configuration and certificate validity.

#### PowerShell Testing Script

Test headers locally:

```powershell
# Test security headers
$response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
$response.Headers | Format-Table

# Test API CORS
$apiResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/testdb" `
  -Method GET `
  -Headers @{"Origin"="http://localhost:3000"} `
  -UseBasicParsing

Write-Host "CORS Headers:" -ForegroundColor Green
$apiResponse.Headers.'Access-Control-Allow-Origin'
$apiResponse.Headers.'Access-Control-Allow-Methods'
```

### Configuration Checklist

- [x] **HSTS** configured with 2-year max-age and preload
- [x] **CSP** configured with trusted sources (customize for your integrations)
- [x] **CORS** configured with explicit allowed origins (no wildcards)
- [x] **X-Frame-Options** set to DENY
- [x] **X-Content-Type-Options** set to nosniff
- [x] **Referrer-Policy** configured for privacy
- [x] **Middleware** applies CORS to all API routes
- [x] **Preflight OPTIONS** requests handled correctly
- [ ] **Production origins** updated in `corsConfig.js`
- [ ] **CSP domains** customized for your CDNs/analytics
- [ ] **Security scan** performed on production deployment

---

## Cloud Database Configuration (RDS / Azure SQL)

- Provisioned a managed PostgreSQL instance (AWS RDS/Azure SQL) for the app.
- Configured secure network access (IP allowlisting for development).
- Connected the Next.js app to the cloud database using the DATABASE_URL in `.env.local`.
- Verified the connection using the `/api/testdb` endpoint (returns table counts if successful).
- Enabled automated backups on the cloud database.
- Documented the process and best practices for production (private endpoints, backups, scaling).

See the `/rurallite/app/api/testdb/route.js` and `/rurallite/lib/prisma.js` for implementation details.

---

## ✅ Secure File Uploads with AWS S3

This project implements secure, production-ready file uploads using AWS S3. All uploads use pre-signed URLs, strict file type and size validation (client and server), private ACL, and server-side encryption. Credentials are never exposed, and all configuration is managed via environment variables. The upload flow is robust, user-friendly, and follows industry best practices for cloud object storage.


### Customization for Deployment

Before deploying to production:

1. **Update allowed origins** in [rurallite/lib/corsConfig.js](rurallite/lib/corsConfig.js):
   ```javascript
   const ALLOWED_ORIGINS = [
     'https://your-actual-domain.com',
     'https://www.your-actual-domain.com',
     'https://rurallite.vercel.app'  // Update with your Vercel domain
   ];
   ```

2. **Customize CSP** in [rurallite/next.config.mjs](rurallite/next.config.mjs) based on your integrations:
   - Add your CDN domains to `img-src`
   - Add analytics domains (Google Analytics, Mixpanel, etc.) to `script-src` and `connect-src`
   - Add font CDNs to `font-src`
   - Remove `'unsafe-inline'` and `'unsafe-eval'` if possible for stricter security

3. **Test thoroughly** after CSP changes:
   - Check browser console for CSP violations
   - Test all features (login, file upload, API calls)
   - Verify third-party integrations work

### Security Best Practices

✅ **Never use `Access-Control-Allow-Origin: *` in production** → Always specify exact domains  
✅ **Test CSP changes thoroughly** → A strict CSP can break functionality  
✅ **Use HTTPS in production** → HSTS only works over HTTPS  
✅ **Monitor CSP violations** → Use CSP reporting to catch issues  
✅ **Keep headers updated** → Security best practices evolve  
✅ **Review third-party scripts** → Only load from trusted sources  
✅ **Document all CORS origins** → Keep track of why each domain is allowed

### Impact on Third-Party Integrations

**CSP may affect:**
- ❌ Inline scripts and styles (use `nonce` or `hash` instead of `'unsafe-inline'`)
- ❌ External analytics (Google Analytics, Mixpanel) - must be whitelisted
- ❌ External fonts (Google Fonts, Font Awesome) - must be whitelisted
- ❌ CDN resources - must be whitelisted

**CORS may affect:**
- ❌ API calls from external domains
- ❌ Mobile app API access - whitelist app domains
- ❌ Third-party webhooks - may need separate endpoint without CORS

### Troubleshooting

**Issue: CSP blocking scripts**
- Check browser console for CSP violation errors
- Add the blocked domain to appropriate CSP directive
- Test with relaxed CSP first, then tighten gradually

**Issue: CORS errors in API calls**
- Verify origin is in `ALLOWED_ORIGINS`
- Check if preflight OPTIONS request is being handled
- Ensure `Access-Control-Allow-Credentials: true` if sending cookies

**Issue: Resources not loading over HTTPS**
- Check for mixed content warnings in console
- Use `upgrade-insecure-requests` in CSP
- Ensure all resources use HTTPS URLs

### Screenshot Evidence

After testing, document your security implementation:

1. **Browser DevTools Headers Screenshot**
   - Save to `screenshots/security-headers.png`
   - Show Response Headers with all security headers visible

2. **Security Scan Results**
   - Run scan on [securityheaders.com](https://securityheaders.com)
   - Save result to `screenshots/security-scan.png`
   - Target: A or A+ grade

3. **CORS Test Screenshot**
   - Show successful API call with CORS headers
   - Save to `screenshots/cors-headers.png`

### Reflection

**Why HTTPS enforcement matters:**
- Protects user credentials and sensitive data in transit
- Prevents session hijacking and man-in-the-middle attacks
- Required for modern browser features (Service Workers, PWA)
- Builds user trust (green padlock in address bar)

**How security headers improve our app:**
- **Multiple layers of defense** → Security headers work together
- **Minimal performance impact** → Headers are lightweight
- **Proactive protection** → Prevents attacks before they happen
- **Standards compliance** → Follows OWASP recommendations

**Balancing security and flexibility:**
- Strict CSP requires careful configuration for third-party services
- CORS restrictions may complicate API integrations
- Some legacy browsers may not support all headers
- Must document all exceptions and their reasons

**For rural/offline context:**
- Service Worker requires HTTPS to function
- Offline-first PWA architecture depends on secure contexts
- Local caching is more secure with CSP protecting cached content
- Background sync requires secure connection for data uploads

### Complete Documentation

For detailed implementation guide, testing procedures, troubleshooting, and production deployment checklist, see:

📚 **[Complete Security Headers Documentation](./SECURITY_HEADERS.md)**

---

## 🔀 Git Workflow & Collaboration

### Branch Naming Conventions

Our team follows a consistent branching strategy for clarity and traceability:

| Branch Type       | Pattern                  | Example                     |
| ----------------- | ------------------------ | --------------------------- |
| **Feature**       | `feature/<feature-name>` | `feature/login-auth`        |
| **Bug Fix**       | `fix/<bug-name>`         | `fix/navbar-alignment`      |
| **Chore**         | `chore/<task-name>`      | `chore/update-dependencies` |
| **Documentation** | `docs/<update-name>`     | `docs/update-readme`        |

### Pull Request Template

We use a standardized PR template located at `.github/pull_request_template.md` that includes:

- Summary of changes
- List of key updates
- Screenshots/evidence
- Type of change (feature/fix/chore/docs)
- Comprehensive checklist
- Related issue links

### Code Review Checklist

Every PR must pass this checklist before merging:

- [ ] **Code Quality**: Follows naming conventions and project structure
- [ ] **Functionality**: Verified locally and tested
- [ ] **Build Status**: Code builds successfully without errors
- [ ] **Linting**: ESLint + Prettier checks pass
- [ ] **Console**: No console errors or warnings
- [ ] **Documentation**: Comments and docs are meaningful
- [ ] **Security**: No sensitive data exposed (.env files excluded)
- [ ] **Tests**: All tests pass (when applicable)
- [ ] **Review**: Reviewed by at least one teammate
- [ ] **Issue Link**: Linked to corresponding issue

### Branch Protection Rules

Our `main` branch is protected with:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (lint/test workflows)
- ✅ Disallow direct pushes to main
- ✅ Require branches to be up to date before merging

### Why This Workflow?

**Code Quality**: Automated checks catch issues before they reach production  
**Collaboration**: Clear templates and checklists improve communication  
**Velocity**: Parallel development without merge conflicts  
**Trust**: Every change is reviewed, tested, and documented  
**Traceability**: Branch naming and PR links create clear history

---

## �🔄 Offline Sync Logic

### When offline:

- Lessons load from indexedDB
- Quiz results stored locally
- Notes saved to local database

### When reconnected:

- Syncs quiz results → cloud
- Downloads new lessons → cache
- Updates service worker assets

---

## 🤝 Contributing

PRs are welcome!
Please open an issue to discuss major changes before submitting a pull request.

---

## 📜 License

MIT License © 2024–2025 RuralLite Project

---

## 👥 Team TriVengers

Built with ❤️ for improving rural education accessibility

---

## 📝 Day 1 - Project Initialization Checklist

- [x] Set up Next.js project with Tailwind CSS
- [x] Create folder structure following best practices
- [x] Add .gitignore for node_modules, .env, .next
- [x] Design and implement homepage hero section
- [x] Document project structure in README
- [x] Add setup instructions and naming conventions
- [x] Run app locally and capture screenshot
- [x] Write reflection on structure and scalability

---

## 📝 Day 2 - Team Workflow & Git Setup

- [x] Defined branch naming conventions (feature/fix/chore/docs)
- [x] Created PR template in `.github/pull_request_template.md`
- [x] Documented code review checklist
- [x] Configured branch protection rules on main
- [x] Added Git workflow section to README
- [x] Enabled TypeScript strict mode in `tsconfig.json`
- [x] Configured ESLint + Prettier for consistent formatting
- [x] Set up Husky pre-commit hook with `lint-staged`
- [x] Created `.env.example` for environment variable management
- [x] Updated `.gitignore` to exclude sensitive `.env` files

---

## 📝 Day 3 - Prisma ORM & Database Setup

- [x] Installed Prisma and initialized project
- [x] Designed MongoDB schema for RuralLite (User, Lesson, Quiz, Progress, Note models)
- [x] Added offline-first features (syncedAt, downloadSize, isOffline fields)
- [x] Generated Prisma Client with TypeScript types
- [x] Created singleton Prisma client in `lib/prisma.js`
- [x] Added test connection file with sample queries
- [x] Updated `.env.example` with DATABASE_URL
- [x] Documented Prisma setup, schema design, and benefits in README

---

## 📝 Day 3 - Prisma & PostgreSQL

- Added a normalized Prisma schema (`prisma/schema.prisma`) with models: User, Team, Project, Task, Comment, Tag, and related join tables.
- Created migration files and an initial SQL migration, and added a seed script (`prisma/seed.js`) that inserts example users, teams, projects, tasks, tags, and comments.
- Implemented a Prisma client helper (`rurallite/prismaClient.js`) and a simple API route (`/api/testdb`) to verify DB connectivity and seeded counts.
- Updated `rurallite/package.json` with Prisma scripts (`prisma:generate`, `prisma:migrate`, `prisma:studio`, `prisma:seed`) and added `.env` examples for local development.

---

## 📝 Day 4 — Transactions & Query Optimization

- [x] Implement transaction demo and rollback verification (`rurallite/scripts/transaction_demo.js`, API at `app/api/transactions/demo/route.js`)
- [x] Add `Product`, `Order`, and `OrderItem` models with indexes in `rurallite/prisma/schema.prisma`
- [x] Seeded sample products in `rurallite/prisma/seed.js`
- [x] Added benchmark script (`rurallite/scripts/bench_index_flip.js`) and captured real `EXPLAIN ANALYZE` outputs (`rurallite/benchmarks/real_before.txt`, `rurallite/benchmarks/real_after.txt`)
- [x] Documented workflow and findings in `rurallite/TRANSACTIONS_AND_INDEXES.md`

## 📝 Day 5 — Global API Response Handler

- [x] **Utility:** Added a unified response handler `rurallite/lib/responseHandler.js` exposing `sendSuccess` / `sendError` and helpers `buildSuccess` / `buildError` for envelope construction and typing.
- [x] **Error codes:** Added `rurallite/lib/errorCodes.js` to standardize error codes across endpoints.
- [x] **Route integration:** Initially updated `app/api/users/route.js` and `app/api/quizzes/route.js`; then applied the handler across additional routes (`users/[id]`, `notes`, `lessons`, `progress`, `quiz-results`, `testdb`, `transactions/demo`) to ensure consistent envelopes.
- [x] **Documentation:** Updated `rurallite/README.md` with the unified response envelope shape, example success/error JSON, and code usage snippets.
- [x] **Tests & types (optional):** Added TypeScript types and `tests/responseHandler.test.ts` (Vitest) validating envelope shapes; tests pass locally.
- [x] **Quality checks:** Installed deps, ran ESLint and TypeScript (`npx tsc`), and addressed minor issues introduced during the change.

**Why this helps:** Consistent API responses reduce frontend complexity, improve observability (error codes + timestamps), and make the API easier to debug and maintain.

## 📝 Day 6 — Input Validation with Zod

Implemented input validation for POST and PUT endpoints using Zod. Added a shared schema at `rurallite/lib/schemas/userSchema.js` and applied it to the users routes to ensure consistent server-side validation. Validation failures now return structured errors (field + message) with `VALIDATION_ERROR` and HTTP 400, making errors easier to consume by clients. This enables schema reuse between client and server and improves overall API reliability.

Code snippet — schema ( `rurallite/lib/schemas/userSchema.js` ):

```js
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
});

export const userUpdateSchema = userSchema.partial();
```

### Request examples:

**Passing example:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"STUDENT"}'
```

**Failing example (invalid data):**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"bademail"}'
```

**Expected failing response (HTTP 400):**

```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "E001",
    "details": [
      { "field": "name", "message": "Name must be at least 2 characters long" },
      { "field": "email", "message": "Invalid email address" }
    ]
  },
  "timestamp": "2025-12-17T...Z"
}
```

## 📝 Day 7 — Error Handling Middleware

- [x] Centralized error handling implemented in `rurallite/lib/errorHandler.js` (exports `handleError`).
- [x] Structured JSON logging in `rurallite/lib/logger.js`.
- [x] Unit tests:
  - `rurallite/tests/errorHandler.test.ts`
  - `rurallite/tests/logger.test.ts`
- [x] Run tests (from repo root):
  - `npm test --prefix rurallite` (or from `rurallite/`: `npm test`)
- Note for Windows: run tests in Command Prompt (cmd) or use `npm.cmd` if PowerShell blocks scripts.

## 📝 Day 8 - Redis Caching Layer

- Redis client: `ioredis` is configured in `rurallite/lib/redis.js` using `REDIS_URL` (defaults to `redis://localhost:6379`) with a single shared connection and health logs for ready/error/reconnect events.
- Cached endpoint: GET `/api/users` now uses a cache-aside strategy in `rurallite/app/api/users/route.js` with key pattern `users:list:p{page}:l{limit}` and a 60 second TTL. Cache reads/writes are wrapped so the route falls back to Prisma when Redis is unavailable.
- Invalidation: POST `/api/users` clears keys matching `users:list:*` after creating a user to prevent stale pagination results. Extend the same pattern to future update/delete endpoints.
- Behavior snapshot (excerpt):

```js
// rurallite/app/api/users/route.js
const cacheKey = `users:list:p${page}:l${limit}`;
const cached = await redis.get(cacheKey);
// ...on miss: fetch from Prisma then seed cache for 60s
await redis.set(cacheKey, JSON.stringify({ users, meta }), "EX", 60);
```

- How to observe:
  - Ensure Redis is running (`docker-compose up redis` or your managed endpoint).
  - First call: `curl -X GET http://localhost:3000/api/users` logs a cache miss and hits the database.
  - Second call within 60s: logs `users:list cache hit` and returns faster (compare timestamps or use a local timer to see latency drop versus the cold call).
  - Inspect keys and TTLs: `docker-compose exec redis redis-cli keys "users:list:*"` and `ttl <key>`.
- Stale data considerations: TTL and post-create invalidation limit staleness to roughly 60 seconds. Avoid caching endpoints that change every request or need real-time freshness; for read-heavy lists (users, lessons, quizzes) the current policy favors latency and lower DB load.

## 📝 Day 9 - Email Service Integration (SendGrid / AWS SES) ✅

Five key deliverables completed in this assignment:

- [x] Implemented a transactional email API endpoint at `/api/email` (`rurallite/app/api/email/route.js`) that accepts POST requests, validates input, and supports sending custom HTML or templated emails.
- [x] Added a provider-agnostic email service at `rurallite/lib/email.js` supporting **SendGrid** and **AWS SES**, with auto-detection from env vars (`SENDGRID_API_KEY` or `AWS_*`) and optional `EMAIL_PROVIDER` override.
- [x] Created reusable HTML templates in `rurallite/lib/emailTemplates.js` (e.g., `welcomeTemplate`, `passwordResetTemplate`) and wired a `type: "welcome"` option in the API for easy use.
- [x] Updated documentation and README with configuration details, example curl commands, sandbox vs production notes, and operational considerations (rate limits, bounce handling, SPF/DKIM).
- [x] Added dependencies (`@sendgrid/mail`, `@aws-sdk/client-ses`), handled install issues, and provided test instructions plus console log evidence (SendGrid headers or SES MessageId) for verification.

## 📝 Day 10 - Form handling and validation 
- [x] Implemented global state management using the React Context API and custom hooks in a Next.js application. 
- [x] Created AuthContext for authentication state and UIContext for UI state such as theme toggling and sidebar visibility, both provided through the root layout to avoid prop drilling. 
- [x] Built reusable custom hooks (useAuth and useUI) to encapsulate context logic and keep components clean and declarative.
- [x] Upgraded data fetching by implementing SWR, replacing basic fetch calls with caching, revalidation, and optimistic UI updates. 
- [x] Achieved instant page loads, immediate UI updates for create and delete actions, and reduced network requests by approximately 60% with smart auto-refresh intervals and a development Cache Inspector.
- [x] Implemented reusable form handling and validation using React Hook Form and Zod, including a shared FormInput component, clear schema-based error messages, and improved accessibility with proper labels, inline feedback, and aria-invalid attributes.

## 📝 Day 11 - Feedback UI (Toasts, Modals & Loaders)

To improve user experience and trust, interactive feedback UI elements were added across the application.

### Implemented Features
- Toast notifications for instant success and error feedback
- Confirmation modal for destructive actions
- Loaders for async operations like form submission and deletion

### Trigger Points
- Login and signup form submissions
- API success and failure states
- Delete confirmation actions

## 🐳 Docker & Docker Compose Setup

### Overview

This section covers containerizing the RuralLite application stack for consistent local development and deployment. The Docker setup includes:

- **Next.js Application** (Node.js 20-Alpine)
- **PostgreSQL Database** (v15-Alpine) for data persistence
- **Redis Cache** (v7-Alpine) for session management and caching

Using Docker and Docker Compose ensures that every team member runs the exact same environment, eliminating the classic "it works on my machine" problem.

### Project Files

#### 1. **Dockerfile** (Next.js Application)

```dockerfile
# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rurallite subdirectory contents
COPY rurallite ./rurallite

# Set working directory to rurallite app
WORKDIR /app/rurallite

# Install app dependencies
RUN npm install

# Build the Next.js app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
```

**Why Alpine?** Alpine Linux is lightweight (~5MB) compared to standard Node images, resulting in faster builds and smaller image sizes.

#### 2. **docker-compose.yml** (Service Orchestration)

The `docker-compose.yml` file orchestrates three services:

**App Service (Next.js)**

- Builds from the Dockerfile
- Exposes port 3000
- Environment variables for database and Redis connections
- Depends on PostgreSQL and Redis with health checks
- Auto-restart policy for reliability

**Database Service (PostgreSQL)**

- Uses Alpine image for efficiency
- Persistent storage with named volume `db_data`
- Exposed on port 5432
- Health check to ensure readiness before app starts
- Credentials: `postgres` / `password` (change in production!)

**Redis Service (Redis)**

- Cache layer for sessions and temporary data
- Exposed on port 6379
- Health check via `redis-cli ping`
- Auto-restart enabled

**Network & Volumes**

- **localnet**: Custom bridge network for inter-service communication
- **db_data**: Named volume for PostgreSQL data persistence

### Quick Start

#### Prerequisites

- **Docker**: [Download & Install](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Included with Docker Desktop

#### Starting the Stack

```bash
# From the project root directory
docker-compose up --build
```

This command:

1. Builds the Next.js app image
2. Pulls PostgreSQL and Redis images
3. Creates the network and volumes
4. Starts all three services

**Expected Output:**

```
Creating network "localnet" with driver "bridge"
Creating volume "db_data" with default driver
Building app
[...]
trivengers_nextjs_app is running on port 3000
trivengers_postgres_db is running on port 5432
trivengers_redis_cache is running on port 6379
```

#### Verifying All Services

```bash
# Check running containers
docker ps

# Expected output:
# CONTAINER ID   IMAGE        PORTS                    NAMES
# abc123...      node:20...   0.0.0.0:3000->3000/tcp   trivengers_nextjs_app
# def456...      postgres:15  0.0.0.0:5432->5432/tcp   trivengers_postgres_db
# ghi789...      redis:7      0.0.0.0:6379->6379/tcp   trivengers_redis_cache
```

#### Access Services

- **Next.js App**: http://localhost:3000
- **PostgreSQL**: `localhost:5432` (use connection string in app)
- **Redis**: `localhost:6379` (use connection string in app)

### Environment Variables

The `docker-compose.yml` sets the following environment variables in the Next.js container:

```yaml
DATABASE_URL=postgresql://postgres:password@db:5432/trivengers_db
REDIS_URL=redis://redis:6379
NODE_ENV=production
```

**Important:** Change the default PostgreSQL password in production. Update both `docker-compose.yml` and your `.env.local` file.

### Common Commands

#### View Container Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis
```

#### Stop All Services

```bash
docker-compose down
```

#### Stop and Remove Data

```bash
# Warning: This deletes the database!
docker-compose down -v
```

#### Restart Services

```bash
docker-compose restart
```

#### Execute Commands in Container

```bash
# Access Next.js app container
docker-compose exec app sh

# Access PostgreSQL container
docker-compose exec db psql -U postgres -d trivengers_db

# Access Redis container
docker-compose exec redis redis-cli
```

### Troubleshooting

#### Issue: Port Already in Use

**Problem**: "Port 3000 is already allocated"

**Solution**: Change ports in `docker-compose.yml`:

```yaml
app:
  ports:
    - "3001:3000" # Use 3001 instead
```

#### Issue: Database Connection Error

**Problem**: "Cannot connect to postgres database"

**Solution**:

1. Ensure `db` service is running: `docker ps`
2. Check database logs: `docker-compose logs db`
3. Wait for health check to pass (takes ~10 seconds)

#### Issue: Slow Docker Builds

**Problem**: First build takes several minutes

**Solutions**:

- Ensure stable internet (downloading images)
- Use `.dockerignore` to exclude unnecessary files
- Add build cache: `docker builder prune --all`

#### Issue: Permission Errors

**Problem**: "Permission denied" on Windows with WSL2

**Solution**:

```bash
# Run Docker Desktop with WSL2 backend
# Settings > Resources > WSL integration
```

#### Issue: Redis Connection Failed

**Problem**: "Cannot connect to redis://redis:6379"

**Solution**:

1. Check Redis health: `docker-compose logs redis`
2. Verify network: `docker network inspect localnet`
3. Restart Redis: `docker-compose restart redis`

### Production Considerations

#### Security

- **Change Credentials**: Don't use `password` in production
- **Use Secrets**: Store sensitive values in `.env` files (never committed)
- **Network Policies**: Restrict service access with firewall rules
- **SSL/TLS**: Enable encrypted connections to PostgreSQL

#### Performance

- **Multi-stage Builds**: Reduce image size with multi-stage Dockerfile
- **Resource Limits**: Set memory and CPU limits for containers
- **Caching Strategy**: Implement layer caching for faster builds

#### Example Production Compose (Snippet)

```yaml
db:
  image: postgres:15-alpine
  restart: always
  environment:
    POSTGRES_USER: ${DB_USER}
    POSTGRES_PASSWORD: ${DB_PASSWORD} # From .env, never hardcoded
  volumes:
    - db_data:/var/lib/postgresql/data
  networks:
    - localnet
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
```

### Health Checks

All services include health checks that automatically restart failed containers:

- **App**: HTTP GET to `localhost:3000` every 30 seconds
- **Database**: PostgreSQL ready check every 10 seconds
- **Redis**: `redis-cli ping` every 10 seconds

This ensures high availability during local development.

### Reflection & Lessons Learned

#### Challenges Faced

1. **Image Size Optimization**
   - Initially used `node:20` (900MB+), switched to `node:20-alpine` (150MB)
   - Result: 6x smaller images and faster downloads

2. **Service Dependencies**
   - Race condition where app started before PostgreSQL was ready
   - **Solution**: Added `healthcheck` to ensure database is ready before app connects

3. **Network Configuration**
   - Container-to-container communication requires proper networking
   - Used custom bridge network (`localnet`) for service discovery

4. **Volume Management**
   - Data was lost when containers were removed
   - **Solution**: Named volume `db_data` persists PostgreSQL data across restarts

5. **Environment Variables**
   - Hardcoded credentials posed security risks
   - Implemented environment-based configuration for flexibility

#### Key Takeaways

✅ **Docker ensures consistency** across development, testing, and production environments  
✅ **Docker Compose simplifies** multi-service orchestration and team collaboration  
✅ **Health checks prevent** service dependency issues and race conditions  
✅ **Volumes enable** data persistence between container restarts  
✅ **Named containers** make logs and debugging easier to track

#### Next Steps

- Implement CI/CD pipeline (GitHub Actions) to build and push images
- Add database migration scripts to initialize schema
- Configure environment-specific compose files (`docker-compose.dev.yml`, `docker-compose.prod.yml`)
- Document deployment to cloud services (AWS ECS, Azure Container Instances)

---
