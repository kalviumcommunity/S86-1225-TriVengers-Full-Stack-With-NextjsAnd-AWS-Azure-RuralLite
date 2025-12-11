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
- Secure user authentication (Cognito / Azure AD B2C)

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

- **Frontend**: Next.js (React Framework)
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Cloud Services**: AWS (Lambda, S3, Cognito)
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
│   │   │   └── sync/               # Background sync endpoints
│   │   ├── globals.css             # Global styles
│   │   ├── layout.js               # Root layout component
│   │   └── page.js                 # Homepage (Hero section)
│   ├── components/                 # Reusable React components
│   │   ├── ui/                     # UI components (Button, Card, Navigation)
│   │   ├── lessons/                # Lesson-specific components
│   │   └── offline/                # Offline indicator & sync status
│   ├── lib/                        # Utility libraries and helpers
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

| Folder/File | Purpose |
|------------|---------|
| **app/** | Contains all pages and routing logic using Next.js App Router |
| **app/(auth)/** | Groups authentication-related pages (login, register) |
| **app/api/** | Backend API endpoints for authentication, lessons, quizzes, and sync |
| **components/** | Reusable UI components to maintain DRY principle |
| **lib/** | Business logic, database operations, PWA utilities |
| **lib/db/** | IndexedDB wrapper for offline data storage |
| **lib/pwa/** | Service Worker registration and background sync logic |
| **public/** | Static assets served directly (icons, manifest, service worker) |
| **config/** | Application configuration files (API keys, constants) |

### 🏗️ Naming Conventions

- **Files**: kebab-case (e.g., `lesson-card.js`, `auth-provider.js`)
- **Components**: PascalCase (e.g., `LessonCard`, `OfflineIndicator`)
- **API Routes**: RESTful naming (e.g., `/api/lessons`, `/api/quizzes/[id]`)
- **Folders**: lowercase with hyphens for multi-word names

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

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
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=http://localhost:3000
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
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

*Screenshot showing the RuralLite homepage running on localhost:3000*

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

## � Git Workflow & Collaboration

### Branch Naming Conventions

Our team follows a consistent branching strategy for clarity and traceability:

| Branch Type | Pattern | Example |
|------------|---------|---------|
| **Feature** | `feature/<feature-name>` | `feature/login-auth` |
| **Bug Fix** | `fix/<bug-name>` | `fix/navbar-alignment` |
| **Chore** | `chore/<task-name>` | `chore/update-dependencies` |
| **Documentation** | `docs/<update-name>` | `docs/update-readme` |

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