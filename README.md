# Spotify Artists Explorer

> Uma aplicação React moderna e performática para descobrir e explorar artistas do Spotify — construída com **TypeScript**, **React Query**, **Vite** e um polido sistema de design inspirado na estética do Spotify.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.18-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tech Stack](#tech-stack)
- [Começando](#começando)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Arquitetura e Padrões](#arquitetura-e-padrões)
- [Requisitos Atendidos](#requisitos-atendidos)
- [Licença](#licença)

---

## Visão Geral

Este projeto foi desenvolvido como parte de um **desafio técnico para a Kanastra**, com foco em:

**Arquitetura Limpa** – Separação de responsabilidades, estrutura escalável  
**Performance** – Renderização otimizada, cache inteligente, code splitting  
**Experiência do Usuário** – Design responsivo, animações suaves, modo escuro  
**Qualidade de Código** – Type-safe, bem testado, ESLint/Prettier configurado  
**Internacionalização** – Suporte completo PT-BR e EN-US  

O objetivo era criar uma **aplicação frontend de nível profissional** que demonstrasse proficiência técnica mantendo uma UX cuidadosa e atenção aos detalhes.

---

## Funcionalidades

### Busca e Descoberta
- Buscar artistas por nome com filtro inteligente
- Filtrar por nome de álbum
- Paginação (20 itens por página)
- Input de busca responsivo com debounce
- Histórico de buscas em tempo real

### Detalhes do Artista
- Página de perfil completo do artista
- Top 10 faixas com métricas de popularidade
- Discografia completa de álbuns/singles
- Contagem de seguidores e gêneros
- Link direto para página do artista no Spotify

### Análise e Visualização
- 13+ gráficos interativos incluindo:
  - Tendências de popularidade de artistas
  - Distribuição de popularidade de faixas
  - Análise de gêneros
  - Análise de status de lançamento
  - Visualizações em linhas do tempo
  - Distribuição de favoritos por métricas

### Favoritos e Avaliações
- Adicionar/remover faixas favoritas
- Avaliar faixas (1-5 estrelas)
- Armazenamento persistente (LocalStorage)
- Favoritos com busca e filtros
- Dashboard de estatísticas de avaliações
- Gráficos detalhados de distribuição

### Faixas Personalizadas
- Registre suas próprias faixas musicais
- Validação de formulário com feedback em tempo real
- Metadados de faixa: nome, artista, álbum, ano, gênero, duração
- Toggle de status de lançamento
- Gerenciar e editar faixas personalizadas
- Visualizar estatísticas de faixas personalizadas

### Internacionalização (i18n)
- Suporte completo PT-BR e EN-US
- Seletor de idioma no header
- Todo conteúdo traduzido
- Formatação de data/número sensível à localidade
- Preferência de idioma persistente

### Sistema de Temas
- Modo claro/escuro com autodetecção
- Respeita preferências do sistema
- Transições suaves de tema
- Seleção de tema persistente
- UI linda em ambos os modos

### Design Responsivo
- Abordagem mobile-first
- Otimizado para todos os tamanhos de tela
- Interações touch-friendly
- Layout grid fluido
- Dimensionamento adaptativo de gráficos

### Performance
- Cache de estado de servidor com React Query
- Lazy loading de componentes
- Code splitting para carregamentos mais rápidos
- Tamanho de bundle otimizado (332KB gzip)
- Re-renderização eficiente com memoização

---

## Tech Stack

### Framework Principal
- **React 19.1.1** – Biblioteca de UI com hooks
- **TypeScript 5.9.3** – JavaScript type-safe
- **Vite 7.1.7** – Ferramenta de build ultra-rápida
- **React Router 7.9.4** – Roteamento no lado cliente

### Gerenciamento de Estado e Dados
- **React Query 5.90.5** – Gerenciamento de estado de servidor & cache
- **Context API + useReducer** – Gerenciamento de estado cliente
- **Axios 1.12.2** – Cliente HTTP

### UI e Styling
- **Tailwind CSS 3.4.18** – Framework CSS utility-first
- **Lucide React 0.546.0** – Biblioteca de ícones bela
- **Framer Motion 12.23.24** – Animações suaves
- **Recharts 3.3.0** – Gráficos componíveis

### Formulários e Validação
- **React Hook Form 7.65.0** – Formulários performáticos
- **Zod 4.1.12** – Validação schema-first com TypeScript
- **@hookform/resolvers** – Integração de form resolver

### Internacionalização
- **react-i18next 16.1.2** – Framework i18n
- **i18next-browser-languagedetector** – Autodetecção de idioma

### Experiência do Desenvolvedor
- **ESLint 9.38.0** – Linting de qualidade de código
- **Prettier 3.6.2** – Formatação de código
- **Husky 9.1.7** – Git hooks
- **Commitlint 20.1.0** – Validação de mensagens de commit
- **Vitest 3.2.4** – Testes unitários
- **Playwright 1.56.1** – Testes E2E

---

## Começando

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ ou **yarn** 3+ (vem com Node)
- **Git** para clonar o repositório

### Instalação

#### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/spotify-artists-explorer.git
cd spotify-artists-explorer
```

#### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

#### 3. Configuração de ambiente
Crie um arquivo `.env` no diretório raiz (copie de `.env.example`):

```env
# Configuração da API do Spotify
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui

# Configuração de Desenvolvimento
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

**Como obter credenciais da API do Spotify:**
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie uma nova aplicação
3. Aceite os termos e crie
4. Copie seu **Client ID** e **Client Secret**
5. Cole no seu arquivo `.env`

#### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## Estrutura do Projeto

```
src/
├── assets/              # Imagens e arquivos estáticos
├── components/
│   ├── albums/          # Componentes de álbum
│   ├── artists/         # Componentes de artista
│   ├── charts/          # Visualizações de gráficos (13+)
│   ├── favorites/       # Gerenciamento de favoritos
│   ├── forms/           # Componentes de formulário
│   ├── layout/          # Wrapper de layout
│   ├── tracks/          # Componentes de faixa
│   ├── error-boundary/  # Tratamento de erros
│   └── ui/              # Componentes base reutilizáveis
├── contexts/            # Provedores React Context
│   ├── custom-tracks-context.tsx
│   └── ratings-context.tsx
├── features/
│   ├── i18n/            # Setup de internacionalização
│   └── theme/           # Gerenciamento de tema
├── hooks/               # Custom React hooks
│   ├── useFavorites.ts
│   ├── useRatings.ts
│   ├── useSpotify.ts
│   └── useTheme.ts
├── locales/             # Arquivos de tradução (PT-BR, EN-US)
├── lib/                 # Utilitários e libs (logger, error-reporter, etc)
├── pages/               # Componentes de página
│   ├── albums/
│   ├── artists/
│   ├── dashboard/
│   ├── favorites/
│   └── tracks/
├── services/
│   └── spotifyService.ts  # Serviço de API do Spotify
├── types/               # Definições de tipos TypeScript
├── utils/               # Funções utilitárias
└── App.tsx              # Componente raiz
```

---

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicie o servidor de desenvolvimento
npm run build        # Construa para produção
npm run preview      # Visualize a construção de produção
```

### Qualidade de Código
```bash
npm run lint         # Execute ESLint
npm run lint:fix     # Corrija problemas de ESLint
npm run format       # Formate com Prettier
npm run format:check # Verifique formatação
npm run type-check   # Verificação de tipo TypeScript
```

### Testes
```bash
npm run test         # Execute testes unitários
npm run test:ui      # Execute testes com UI
npm run test:coverage # Gere relatório de cobertura
npm run test:e2e     # Execute testes E2E
npm run test:e2e:ui  # Execute testes E2E com UI
npm run test:all     # Execute todos os testes
```

---

## Arquitetura e Padrões

### Gerenciamento de Estado

**Estado de Servidor (React Query)**
- Cache de respostas da API do Spotify
- Manipulação de estados loading/error
- Refetching e revalidação automática

**Estado Cliente (Context API + useReducer)**
```
RatingsContext        → Avaliações do usuário (add, update, remove, stats)
CustomTracksContext   → Faixas personalizadas (operações CRUD)
ThemeContext          → Preferência de modo claro/escuro
I18nContext           → Seleção de idioma (PT-BR/EN-US)
```

### Padrões de Componentes

**Componentes de Página** – Contêineres no nível de rota  
**Componentes de Recurso** – Contêineres de recurso reutilizáveis  
**Componentes UI** – Base apresentacional reutilizável  
**Componentes de Hook** – Custom React hooks para reutilização de lógica  

### Manipulação de Formulários

**React Hook Form + Zod**
- Validação no lado cliente com abordagem schema-first
- Validação de campo em tempo real
- Dados de formulário type-safe
- Manipulação e exibição automática de erros

### Integração de API

**Serviço Spotify** – Cliente API centralizado
- Instância Axios com URL base
- Tratamento de erros com mensagens customizadas
- Métodos para artistas, álbuns, faixas, busca

---

## Requisitos Atendidos

### Requisitos Funcionais (Obrigatórios)
- [x] Demo funcional com requisições funcionando
- [x] Listagem artistas com paginação (20 itens/página)
- [x] Filtros por nome e álbum
- [x] Página de detalhes com info artista + top tracks + álbuns
- [x] Tabela paginada de músicas/álbuns
- [x] Tradução PT-BR e EN-US
- [x] Gráficos interativos (13+)
- [x] Formulário cadastro de músicas favoritas
- [x] Listagem de músicas favoritadas

### Requisitos Técnicos (Obrigatórios)
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

### Diferenciais Implementados
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
- [x] Design responsivo
- [x] Histórico de busca
- [x] Sistema de avaliações
- [x] Registro de faixas personalizadas
- [x] JSDoc Documentation completo
- [x] Structured Logging (Logger, ErrorReporter, RequestLogger)
- [x] Testes abrangentes (unitários, integração, E2E)

---

## Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Feito com ❤️ por Fabiano Lanzoni**

Última atualização: 2025
