#INITIAL README -> Under construction

Spotify Artists App

A modern React application for discovering and exploring Spotify artists — built with TypeScript, React Query, and a polished design system inspired by Spotify’s aesthetics.

Project Overview

This project was built as part of a technical challenge for Kanastra, with a focus on clean architecture, performance, and developer experience.

The goal was to design a scalable, maintainable application that demonstrates not only technical proficiency but also thoughtful UX and attention to detail — from code quality to user interaction.

 Features

🎨 Light/Dark Mode – Seamless theme switching with system preference detection

🔍 Artist Search – Find artists by name or album with pagination

📊 Interactive Charts – Visualize artist popularity and track data

❤️ Favorites System – Save and manage your favorite tracks (LocalStorage)

🌍 Internationalization – Full PT-BR and EN-US language support

📱 Responsive Design – Optimized layout for mobile, tablet, and desktop

⚡ Performance Optimized – React Query caching, lazy loading, and code splitting


Key Engineering Decisions

React Query for server state management and caching of Spotify API data.

Context API + useReducer for predictable and centralized client-side state.

Zod + React Hook Form for robust, type-safe form validation.

i18n setup for real internationalization, not just static translations.

Theme system (light/dark) persisted via LocalStorage and system detection.

Vite + TypeScript for a fast and strongly-typed DX.

Principle: Separation of concerns between UI, state, and data layers for maintainability and scalability.

Tech Stack
Core

React 18

TypeScript

Vite

Tailwind CSS


State & Data

Context API + useReducer

React Query (TanStack Query)

Axios


Forms & Validation

React Hook Form

Zod


Dev Experience

ESLint + Prettier

Husky + Commitlint

Vitest + Playwright


UI / Charts / Icons

Lucide React

Recharts


Getting Started
Prerequisites

Node.js 18+

npm or yarn

Installation
git clone <repository-url>
cd spotify-artists-app
npm install
npm run dev


Then open: http://localhost:5173

Configuration

Create a .env.local file:

VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

🏗️ Project Structure
src/
├── components/
│   ├── ui/           # Base reusable UI components
│   └── layout/       # Layout and structural components
├── contexts/         # Global context (theme, language, favorites)
├── hooks/            # Custom reusable hooks
├── lib/              # Axios config, helpers
├── types/            # TypeScript interfaces and models
├── locales/          # i18n translations (PT-BR / EN-US)
└── pages/            # Route-level components

Design System
Color Palette

Primary Orange: #f97316

Dark Theme: Optimized deep palette for music content

Light Theme: Clean, neutral base

Semantic Colors: Success, warning, error

Typography

Font: Inter

Weights: 300–700

Responsive scaling for readability across devices


Testing

Unit Tests: Vitest + React Testing Library

E2E Tests: Playwright

Coverage: Configured with built-in reporting

Pre-commit Hooks: Linting, formatting, and type-check before every commit


Responsive Design
Device	Layout
Mobile	Single-column stacked layout
Tablet	2-column artist grid
Desktop	3-column adaptive grid
♿ Accessibility

WCAG-AA compliant color contrast

ARIA roles and labels for screen readers

Full keyboard navigation

Focus management and visual indicators


Performance Optimizations

Code-splitting and route-based lazy loading

React Query caching and stale-while-revalidate strategy

Tailwind JIT compilation for minimal CSS footprint

Lighthouse score > 95 on all metrics

Preview
Light Mode	Dark Mode

	

Live Demo: spotify-artists-fabiano.vercel.app

Demo Video (optional): Watch on Loom


Future Improvements

OAuth flow to authenticate with real Spotify accounts

Infinite scroll for artist albums and top tracks

Advanced chart interactions and filters

User profile with persisted preferences

Lighthouse CI for automated performance audits

License

This project was developed as part of a technical hiring challenge for Kanastra.

Author

Built with ❤️ by Fabiano Lanzoni
Staff Software Engineer candidate — passionate about clean architecture, great DX, and thoughtful UX.

“Good software feels simple on the surface — because it was built on complex ideas handled elegantly.”