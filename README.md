# 📘 RuralLite Learning Platform

### Offline-First Educational Web App for Low-Bandwidth Rural Schools

Built with Next.js, **AWS/Azure Cloud Services, and **Progressive Web App (PWA)_ technologies.

---

## 📌 Overview

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

Frontend :NextJS
Backend: NextJS
Database: MongoDB
Deployement: AWS

---

## 🔄 Offline Sync Logic

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
