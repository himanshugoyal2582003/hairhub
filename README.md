# 💇 HairHub India

> **India's Trusted Marketplace for Buying & Selling Human Hair**

HairHub India is a full-stack web marketplace platform connecting human hair sellers across India directly with buyers (wig makers, extension manufacturers, and individual buyers) via direct WhatsApp communication.

---

## 🚀 Features

- **For Sellers**: List human hair with photos, texture specs (length, weight, type, virgin status), pricing, location, and WhatsApp contact details.
- **For Buyers**: Browse, search, and filter verified listings by state, price, length, and hair type, and contact sellers directly with one click on WhatsApp.
- **Admin Moderation Panel**: Moderate listings, manage fake accounts, inspect uploaded images, and view overall platform metrics.
- **Modern Clean UI**: Responsive design with light white theme, smooth animations (Framer Motion), and dark mode support.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Axios, next-themes.
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM, Neon PostgreSQL.
- **Storage & Auth**: Cloudinary (Image Uploads), JWT Authentication (Cookie/Bearer token), bcryptjs.

---

## 📂 Project Structure

```
hair/
├── frontend/     # Next.js 15 Frontend Application
├── backend/      # Express + TypeScript + Drizzle ORM API Server
└── README.md
```

---

## 🚦 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
