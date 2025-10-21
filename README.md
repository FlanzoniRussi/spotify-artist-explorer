# 🎵 Spotify Artists App

A modern React application for discovering and exploring Spotify artists — built with TypeScript, React Query, and a polished design system inspired by Spotify’s aesthetics.

---

## 💡 Project Overview

This project was built as part of a **technical challenge for Kanastra**, with a focus on **clean architecture**, **performance**, and **developer experience**.

The goal was to design a scalable, maintainable application that demonstrates not only technical proficiency but also thoughtful UX and attention to detail — from code quality to user interaction.

---

## ✨ Features

- 🎨 **Light/Dark Mode** – Seamless theme switching with system preference detection  
- 🔍 **Artist Search** – Find artists by name or album with pagination  
- 📊 **Interactive Charts** – Visualize artist popularity and track data  
- ❤️ **Favorites System** – Save and manage your favorite tracks (LocalStorage)  
- 🌍 **Internationalization** – Full PT-BR and EN-US language support  
- 📱 **Responsive Design** – Optimized layout for mobile, tablet, and desktop  
- ⚡ **Performance Optimized** – React Query caching, lazy loading, and code splitting  

---

## 🧠 Key Engineering Decisions

- **React Query** for server state management and caching of Spotify API data.  
- **Context API + useReducer** for predictable and centralized client-side state.  
- **Zod + React Hook Form** for robust, type-safe form validation.  
- **i18n setup** for real internationalization, not just static translations.  
- **Theme system** (light/dark) persisted via LocalStorage and system detection.  
- **Vite + TypeScript** for a fast and strongly-typed DX.  

> **Principle:** Separation of concerns between UI, state, and data layers for maintainability and scalability.

---

## 🛠️ Tech Stack

### 🧩 Core
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

### 🧭 State & Data
- **Context API + useReducer**
- **React Query (TanStack Query)**
- **Axios**

### 🧾 Forms & Validation
- **React Hook Form**
- **Zod**

### ⚙️ Developer Experience
- **ESLint + Prettier**
- **Husky + Commitlint**
- **Vitest + Playwright**

### 🎨 UI / Charts / Icons
- **Lucide React**
- **Recharts**

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js **18+**
- npm or yarn

### ⚡ Installation
```bash
git clone <repository-url>
cd spotify-artists-app
npm install
npm run dev
