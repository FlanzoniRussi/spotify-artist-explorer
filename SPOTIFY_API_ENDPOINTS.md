# 🎵 Endpoints da API Spotify Utilizados

## 📋 Resumo Geral

Sua aplicação utiliza **10 métodos** que chamam **6 endpoints principais** da Spotify Web API.

**Base URL:** `https://api.spotify.com/v1`

**Autenticação:** OAuth 2.0 com Bearer Token (Client Credentials Flow)

---

## 🔍 Endpoints Utilizados

### 1️⃣ **Search Endpoint** - `/search`
**Método HTTP:** `GET`

**Descrição:** Busca em múltiplos tipos (artistas, álbuns, músicas)

**Parâmetros:**
- `q` (string): Termo de busca
- `type` (string): `artist`, `album`, `track`
- `limit` (number): Quantidade de resultados (default: 20, max: 50)
- `offset` (number): Paginação (default: 0)

**Usos na Aplicação:**

#### a) `searchArtists(query, limit, offset)`
```typescript
GET /search?q=artist:"${query}"&type=artist&limit={limit}&offset={offset}
```
- **O que faz:** Busca artistas por nome
- **Retorna:** Lista de artistas com informações (nome, imagem, id, etc)
- **Usado em:** Página de Artistas, Dashboard
- **Query especial:** Usa `artist:"query"` para busca mais precisa

#### b) `searchAlbums(query, limit, offset)`
```typescript
GET /search?q={query}&type=album&limit={limit}&offset={offset}
```
- **O que faz:** Busca álbuns por nome
- **Retorna:** Lista de álbuns
- **Usado em:** Página de Álbuns

#### c) `searchTracks(query, limit, offset)`
```typescript
GET /search?q={query}&type=track&limit={limit}&offset={offset}
```
- **O que faz:** Busca músicas por nome
- **Retorna:** Lista de músicas
- **Usado em:** Busca de Músicas

#### d) `searchAll(filters)`
```typescript
// Executa 3 buscas em paralelo
GET /search?q={query}&type=artist&limit={limit}&offset={offset}
GET /search?q={query}&type=album&limit={limit}&offset={offset}
GET /search?q={query}&type=track&limit={limit}&offset={offset}
```
- **O que faz:** Busca simultânea em artistas, álbuns e músicas
- **Retorna:** Objeto com arrays separados por tipo
- **Usado em:** Dashboard (se houver busca global)
- **Otimização:** Usa `Promise.all()` para requisições paralelas

---

### 2️⃣ **Get Artist Endpoint** - `/artists/{id}`
**Método HTTP:** `GET`

**Descrição:** Obtém informações detalhadas de um artista específico

```typescript
GET /artists/{id}
```

**Usos na Aplicação:**

#### `getArtist(id)`
- **O que faz:** Retorna informações completas do artista
- **Retorna:** 
  - Nome do artista
  - Imagens (álbum art)
  - Gêneros
  - Popularidade (0-100)
  - Seguidores
  - URLs (Spotify profile, etc)
- **Usado em:** Página de detalhes do artista

---

### 3️⃣ **Get Artist Top Tracks** - `/artists/{id}/top-tracks`
**Método HTTP:** `GET`

**Descrição:** Obtém as top 10 músicas mais populares de um artista

```typescript
GET /artists/{id}/top-tracks?market=BR
```

**Parâmetros:**
- `market` (string): Código do país (ex: BR, US, GB)

**Usos na Aplicação:**

#### `getArtistTopTracks(id, market = 'BR')`
- **O que faz:** Retorna as 10 músicas mais populares do artista
- **Retorna:** Array com top tracks, incluindo:
  - Nome da música
  - Duração
  - Popularidade
  - Preview URL
  - Artistas colaboradores
- **Usado em:** Página de detalhes do artista (mostra hits)
- **Market:** Por padrão usa 'BR' (Brasil)

---

### 4️⃣ **Get Artist Albums** - `/artists/{id}/albums`
**Método HTTP:** `GET`

**Descrição:** Obtém todos os álbuns de um artista

```typescript
GET /artists/{id}/albums?limit={limit}&offset={offset}&include_groups=album,single
```

**Parâmetros:**
- `limit` (number): Quantidade por página (default: 20)
- `offset` (number): Para paginação
- `include_groups` (string): `album,single,compilation,appears_on`

**Usos na Aplicação:**

#### `getArtistAlbums(id, limit = 20, offset = 0)`
- **O que faz:** Lista todos os álbuns e singles do artista
- **Retorna:** 
  - Álbums com capas
  - Data de lançamento
  - Total de faixas
  - Informações de paginação
- **Usado em:** Página de detalhes do artista (seção "Álbuns")
- **Filtro:** Inclui albums e singles

---

### 5️⃣ **Get Album Endpoint** - `/albums/{id}`
**Método HTTP:** `GET`

**Descrição:** Obtém informações detalhadas de um álbum

```typescript
GET /albums/{id}
```

**Usos na Aplicação:**

#### `getAlbum(id)`
- **O que faz:** Retorna dados completos do álbum
- **Retorna:**
  - Nome do álbum
  - Artista(s)
  - Capa (imagem)
  - Data de lançamento
  - Total de faixas
  - Tipo de álbum (album, single, compilation)
  - Linkl Spotify
- **Usado em:** Página de detalhes do álbum

---

### 6️⃣ **Get Album Tracks** - `/albums/{id}/tracks`
**Método HTTP:** `GET`

**Descrição:** Obtém todas as faixas de um álbum

```typescript
GET /albums/{id}/tracks
```

**Usos na Aplicação:**

#### `getAlbumTracks(id)`
- **O que faz:** Lista todas as músicas do álbum
- **Retorna:**
  - Nome da faixa
  - Número da faixa
  - Duração
  - Artistas
  - Preview URL
  - Popularidade
- **Usado em:** Página de detalhes do álbum (lista de faixas)

---

### 7️⃣ **Get Track Endpoint** - `/tracks/{id}`
**Método HTTP:** `GET`

**Descrição:** Obtém informações detalhadas de uma música

```typescript
GET /tracks/{id}
```

**Usos na Aplicação:**

#### `getTrack(id)`
- **O que faz:** Retorna dados completos da música
- **Retorna:**
  - Nome da música
  - Artistas
  - Álbum
  - Duração
  - Popularidade (0-100)
  - Modo (maior/menor)
  - Tonalidade
  - Preview URL (30 segundos)
  - Explicitude
  - URL do Spotify
- **Usado em:** Dashboard (análise de músicas), Detalhes de música

---

## 🔐 Autenticação

### Client Credentials Flow

**Endpoint:** `https://accounts.spotify.com/api/token`

```typescript
POST /api/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic {base64(client_id:client_secret)}

grant_type=client_credentials
```

**Retorna:**
```json
{
  "access_token": "BQDu3j...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Na App:** Token armazenado em `localStorage` e renovado automaticamente quando expira (status 401)

---

## 📊 Resumo de Endpoints

| Endpoint | Método | Descrição | Usado em |
|----------|--------|-----------|----------|
| `/search` | GET | Buscar artistas, álbuns, músicas | Dashboard, Artistas, Álbuns |
| `/artists/{id}` | GET | Info do artista | Página artista |
| `/artists/{id}/top-tracks` | GET | Top 10 músicas | Página artista |
| `/artists/{id}/albums` | GET | Álbuns do artista | Página artista |
| `/albums/{id}` | GET | Info do álbum | Página álbum |
| `/albums/{id}/tracks` | GET | Faixas do álbum | Página álbum |
| `/tracks/{id}` | GET | Info da música | Dashboard, Detalhes |

---

## 🎯 Fluxos Principais

### 1. Buscar um Artista
```
usuário digita nome → searchArtists() → GET /search (type=artist) → lista artistas
```

### 2. Ver Detalhes do Artista
```
clica em artista → getArtist(id) → exibe info
                 → getArtistTopTracks(id) → exibe top 10
                 → getArtistAlbums(id) → exibe álbuns
```

### 3. Ver Detalhes do Álbum
```
clica em álbum → getAlbum(id) → exibe info
              → getAlbumTracks(id) → exibe faixas
```

### 4. Ver Detalhes da Música
```
clica em música → getTrack(id) → exibe análise
```

---

## ⚙️ Configuração Necessária

### Variáveis de Ambiente
```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret
```

### Obter Credenciais
1. Ir para https://developer.spotify.com
2. Criar uma aplicação
3. Copiar Client ID e Client Secret
4. Colocar no `.env`

---

## 📈 Rate Limits

**Spotify API Rate Limits:**
- Up to 429 requests per minute
- Sua app está bem abaixo disso

---

## 🚀 Performance

**Otimizações Implementadas:**
- ✅ `Promise.all()` para buscas paralelas
- ✅ Timeout de 10 segundos por requisição
- ✅ Interceptadores para renovação automática de token
- ✅ Tratamento de erros com feedback útil
- ✅ Paginação para resultados grandes

---

## 📚 Documentação Spotify

- [Search API](https://developer.spotify.com/documentation/web-api/reference/search)
- [Get Artist](https://developer.spotify.com/documentation/web-api/reference/get-artist)
- [Get Artist Top Tracks](https://developer.spotify.com/documentation/web-api/reference/get-artists-top-tracks)
- [Get Artist Albums](https://developer.spotify.com/documentation/web-api/reference/get-artists-albums)
- [Get Album](https://developer.spotify.com/documentation/web-api/reference/get-album)
- [Get Album Tracks](https://developer.spotify.com/documentation/web-api/reference/get-album-tracks)
- [Get Track](https://developer.spotify.com/documentation/web-api/reference/get-track)

