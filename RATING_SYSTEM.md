# 🌟 Sistema de Avaliações (Rating System)

## ✨ O que foi implementado

Um sistema completo de **avaliações em estrelas (1-5)** para todas as músicas, artistas, álbuns e faixas customizadas da aplicação.

---

## 📦 Estrutura

### Tipos
- **`UserRating`** - Interface em `src/types/index.ts`
  - Armazena ID, tipo de item, rating (1-5), timestamps
  - Suporta: track, artist, album, custom-track

### Hooks
- **`useRatings.ts`** - Hook customizado com CRUD completo
  - `addOrUpdateRating()` - Adicionar ou atualizar avaliação
  - `removeRating()` - Remover avaliação
  - `getRating()` - Obter avaliação de um item
  - `getRatingStats()` - Estatísticas (média, distribuição)
  - `getRatingsByType()` - Filtrar por tipo
  - Persiste em `localStorage` automaticamente

### Context
- **`ratings-context.tsx`** - RatingsProvider global
  - Disponível em toda a app via `useRatingsContext()`
  - Compartilha estado de ratings entre componentes

### Componentes UI
- **`rating-stars.tsx`** - Componente de stars interativo
  - 5 tamanhos: sm, md, lg
  - Hover feedback com Framer Motion
  - Modo somente leitura (readOnly)

### Componentes Integrados
- **`favorite-item-with-rating.tsx`** - Cards de favoritos com rating
- **`custom-track-item-with-rating.tsx`** - Cards de tracks customizadas com rating

### Gráficos
- **`ratings-distribution-chart.tsx`** - Gráfico de barras (recharts)
  - Distribuição de avaliações
  - Média em tempo real
  - Dark mode suportado

---

## 🎯 Integrações

### FavoritesPage (`/favorites`)
✅ Cada favorito tem **stars interativas** para rating
✅ **Filtros por rating:**
  - Todas as avaliações
  - 5+ ⭐⭐⭐⭐⭐
  - 4+ ⭐⭐⭐⭐
  - 3+ ⭐⭐⭐
✅ **Gráfico de distribuição** na seção de análise

### TrackRegistrationPage (`/register-track`)
✅ Cada música customizada tem **stars interativas**
✅ Suporta todos os itens com tipo `'custom-track'`

### Dashboard
🚧 Próximo: Estatísticas de ratings globais

---

## 💾 Persistência

Ratings são salvos automaticamente em:
```
localStorage['user-ratings'] = JSON.stringify(ratings)
```

Carrega automaticamente ao iniciar a app.

---

## 🧪 Testes

### Unit Tests (11 testes ✅)
Arquivo: `src/test/__tests__/useRatings.test.ts`

Testes incluem:
- ✅ Adicionar rating
- ✅ Atualizar rating
- ✅ Remover rating
- ✅ Obter statistics
- ✅ Persistência em localStorage
- ✅ Validação (1-5)
- ✅ Filtro por tipo
- ✅ Clear all ratings

**Status: 11/11 PASSING**

### E2E Tests
🚧 Próximo: Testes end-to-end (Playwright)

---

## 📊 Exemplo de Uso

### Adicionar rating
```typescript
const { addOrUpdateRating } = useRatingsContext();

addOrUpdateRating(
  'track-123',      // itemId
  'track',          // itemType
  5,                // rating (1-5)
  'Beautiful Song', // itemName
  'Artist Name'     // itemArtist (opcional)
);
```

### Obter rating
```typescript
const { getRating } = useRatingsContext();
const rating = getRating('track-123', 'track'); // 5 ou null
```

### Ver estatísticas
```typescript
const { getRatingStats } = useRatingsContext();
const stats = getRatingStats('track');
// {
//   total: 10,
//   average: 4.2,
//   distribution: { 1: 0, 2: 1, 3: 1, 4: 5, 5: 3 }
// }
```

---

## 🎨 Styling

- **Stars**: Orange (#f97316) quando selecionadas
- **Filtros**: Orange quando ativos
- **Gráfico**: Bar chart com cores adaptadas para dark mode
- **Animações**: Hover scale, tap feedback via Framer Motion

---

## 📈 Estatísticas

| Métrica | Valor |
|---------|-------|
| Arquivos criados | 7 |
| Linhas de código | ~1500 |
| Unit tests | 11 ✅ |
| Componentes | 5 |
| Hooks | 1 |
| Contexts | 1 |
| TypeScript errors | 0 |

---

## 🔄 Fluxo de Dados

```
App.tsx
  ↓
RatingsProvider (Context)
  ↓
useRatingsContext() hook
  ↓
localStorage (persistence)
  ↓
Componentes (FavoritesPage, TrackRegistrationPage)
  ↓
RatingStars (UI)
```

---

## ✅ Checklist

- [x] Tipo UserRating criado
- [x] Hook useRatings implementado
- [x] RatingsProvider criado
- [x] RatingStars component
- [x] Integração em FavoritesPage
- [x] Integração em TrackRegistrationPage
- [x] RatingsDistributionChart
- [x] Filtros de rating
- [x] Unit tests (11/11 passing)
- [ ] E2E tests
- [ ] Dashboard integração

---

## 🚀 Próximas Melhorias

1. E2E tests com Playwright
2. Dashboard ratings widget
3. Recomendações baseadas em ratings
4. Export ratings como CSV
5. Histórico de mudanças de rating
