# 🎵 Spotify Artists Explorer

> A modern, performant React application for discovering and exploring Spotify artists — built with **TypeScript**, **React Query**, **Vite**, and a polished design system inspired by Spotify's aesthetics.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.18-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## 📋 Table of Contents

- [Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Architecture & Patterns](#-architecture--patterns)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Project Overview

This project was built as part of a **technical challenge for Kanastra**, with a focus on:

✨ **Clean Architecture** – Separation of concerns, scalable structure  
⚡ **Performance** – Optimized rendering, caching, code splitting  
🎨 **User Experience** – Responsive design, smooth animations, dark mode  
🧠 **Code Quality** – Type-safe, well-tested, ESLint/Prettier configured  
🌍 **Internationalization** – Full PT-BR and EN-US support  

The goal was to create a **professional-grade frontend application** that demonstrates technical proficiency while maintaining thoughtful UX and attention to detail.

---

## ✨ Features

### 🔍 **Search & Discovery**
- Search artists by name with intelligent filtering
- Filter by album name
- Pagination (20 items per page)
- Responsive search input with debouncing
- Real-time search history

### 👤 **Artist Details**
- Comprehensive artist profile page
- Top 10 tracks with popularity metrics
- Complete album/single discography
- Artist follower count and genres
- Direct link to Spotify artist page

### 📊 **Analytics & Visualization**
- 13+ interactive charts including:
  - Artist popularity trends
  - Track popularity distribution
  - Genre breakdown
  - Release status analysis
  - Timeline visualizations
  - Favorites distribution by metrics

### ❤️ **Favorites & Ratings**
- Add/remove favorite tracks
- Rate tracks (1-5 stars)
- Persistent storage (LocalStorage)
- Favorites with search and filters
- Rating statistics dashboard
- Detailed distribution charts

### 🎵 **Custom Tracks**
- Register your own music tracks
- Form validation with real-time feedback
- Track metadata: name, artist, album, year, genre, duration
- Release status toggle
- Manage and edit custom tracks
- View statistics on custom tracks

### 🌍 **Internationalization (i18n)**
- Full PT-BR and EN-US support
- Language switcher in header
- All content translated
- Locale-aware date/number formatting
- Persistent language preference

### 🎨 **Theme System**
- Light/Dark mode with auto-detection
- Respects system preferences
- Smooth theme transitions
- Persistent theme selection
- Beautiful UI in both modes

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interactions
- Fluid grid layout
- Adaptive chart sizing

### ⚡ **Performance**
- Server state caching with React Query
- Lazy loading of components
- Code splitting for faster loads
- Optimized bundle size (332KB gzip)
- Efficient re-rendering with memoization

---

## 🛠️ Tech Stack

### 🧩 **Core Framework**
- **React 19.1.1** – UI library with hooks
- **TypeScript 5.9.3** – Type-safe JavaScript
- **Vite 7.1.7** – Lightning-fast build tool
- **React Router 7.9.4** – Client-side routing

### 🧭 **State Management & Data**
- **React Query 5.90.5** – Server state management & caching
- **Context API + useReducer** – Client state management
- **Axios 1.12.2** – HTTP client

### 🎨 **UI & Styling**
- **Tailwind CSS 3.4.18** – Utility-first CSS framework
- **Lucide React 0.546.0** – Beautiful icon library
- **Framer Motion 12.23.24** – Smooth animations
- **Recharts 3.3.0** – Composable charts

### 🧾 **Forms & Validation**
- **React Hook Form 7.65.0** – Performant forms
- **Zod 4.1.12** – TypeScript-first schema validation
- **@hookform/resolvers** – Form resolver integration

### 🌍 **Internationalization**
- **react-i18next 16.1.2** – i18n framework
- **i18next-browser-languagedetector** – Auto language detection

### ⚙️ **Developer Experience**
- **ESLint 9.38.0** – Code quality linting
- **Prettier 3.6.2** – Code formatting
- **Husky 9.1.7** – Git hooks
- **Commitlint 20.1.0** – Commit message validation
- **Vitest 3.2.4** – Unit testing
- **Playwright 1.56.1** – E2E testing

---

## 🚀 Getting Started

### ✅ Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ or **yarn** 3+ (comes with Node)
- **Git** for cloning the repository

### ⚡ Installation

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/spotify-artists-explorer.git
cd spotify-artists-explorer
```

#### 2. Install dependencies
```bash
npm install
# or
yarn install
```

#### 3. Environment setup
Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Development Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

**How to get Spotify API credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Accept the terms and create
4. Copy your **Client ID** and **Client Secret**
5. Paste them in your `.env` file

#### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── assets/              # Images and static files
├── components/
│   ├── albums/          # Album components
│   ├── artists/         # Artist components
│   ├── charts/          # Chart visualizations (13+)
│   ├── favorites/       # Favorites management
│   ├── forms/           # Form components
│   ├── layout/          # Layout wrapper
│   ├── tracks/          # Track components
│   └── ui/              # Reusable UI components
├── contexts/            # React Context providers
│   ├── custom-tracks-context.tsx
│   └── ratings-context.tsx
├── features/
│   ├── i18n/            # Internationalization setup
│   └── theme/           # Theme management
├── hooks/               # Custom React hooks
│   ├── useFavorites.ts
│   ├── useRatings.ts
│   ├── useSpotify.ts
│   └── useTheme.ts
├── locales/             # Translation files (PT-BR, EN-US)
├── pages/               # Page components
│   ├── albums/
│   ├── artists/
│   ├── dashboard/
│   ├── favorites/
│   └── tracks/
├── services/
│   └── spotifyService.ts  # Spotify API service
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Root component
```

---

## 📝 Available Scripts

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run test:all     # Run all tests
```

---

## 🏗️ Architecture & Patterns

### State Management

**Server State (React Query)**
- Caches Spotify API responses
- Handles loading/error states
- Automatic refetching and revalidation

**Client State (Context API + useReducer)**
```
📦 RatingsContext    → User ratings (add, update, remove, stats)
📦 CustomTracksContext → Custom tracks (CRUD operations)
📦 ThemeContext      → Light/Dark mode preference
📦 I18nContext       → Language selection (PT-BR/EN-US)
```

### Component Patterns

**Page Components** – Route-level containers  
**Feature Components** – Reusable feature containers  
**UI Components** – Presentational, unstyled base components  
**Hook Components** – Custom React hooks for logic reuse  

### Form Handling

**React Hook Form + Zod**
- Client-side validation with schema-first approach
- Real-time field validation
- Type-safe form data
- Automatic error handling and display

### API Integration

**Spotify Service** – Centralized API client
- Axios instance with base URL
- Error handling with custom messages
- Methods for artists, albums, tracks, search

---

## 🎯 Requisitos Atendidos

### ✅ Functional Requirements (Obrigatórios)
- [x] Demo funcional com requisições funcionando
- [x] Listagem artistas com paginação (20 itens/página)
- [x] Filtros por nome e álbum
- [x] Página de detalhes com info artista + top tracks + álbuns
- [x] Tabela paginada de músicas/álbuns
- [x] Tradução PT-BR e EN-US
- [x] Gráficos interativos (13+)
- [x] Formulário cadastro de músicas favoritas
- [x] Listagem de músicas favoritadas

### ✅ Technical Requirements (Obrigatórios)
- [x] React
- [x] Vite (SPA)
- [x] TypeScript
- [x] Context API com useReducer
- [x] React Query
- [x] Axios
- [x] Tailwind CSS
- [x] React Hook Form
- [x] Zod validation
- [x] i18n (PT-BR e EN-US)
- [x] README com instruções

### 🎁 Diferenciais Implementados
- [x] Validações com Zod
- [x] ESLint + Prettier configurados
- [x] Testes unitários (Vitest)
- [x] Testes E2E (Playwright)
- [x] Dark Mode automático
- [x] Shadcn UI customizado
- [x] Lucide Icons
- [x] Recharts (13 gráficos)
- [x] Framer Motion (animações)
- [x] Error Boundary
- [x] Responsive design
- [x] Search history
- [x] Rating system
- [x] Custom track registration

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Run `npm run lint:fix` before committing
- Run `npm run format` to format code
- Write meaningful commit messages
- Include tests for new features

---

## 📞 Support

For questions or issues:
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/spotify-artists-explorer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/spotify-artists-explorer/discussions)

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Kanastra** for the technical challenge
- **Spotify** for the amazing API
- **Open Source Community** for the fantastic libraries

---

**Made with ❤️ by [Your Name]**

Last updated: 2025
