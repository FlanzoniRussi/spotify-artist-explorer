/**
 * Mock data fixtures for testing
 * Shared across all test files to maintain consistency
 */

export const mockAlbums = [
  {
    id: '1',
    name: 'Test Album 1',
    artists: [{ name: 'Test Artist 1' }],
    images: [{ url: 'https://example.com/image1.jpg' }],
    release_date: '2024-01-01',
    total_tracks: 12,
    album_type: 'album',
    external_urls: { spotify: 'https://spotify.com/album/1' },
  },
  {
    id: '2',
    name: 'Test Album 2',
    artists: [{ name: 'Test Artist 2' }],
    images: [{ url: 'https://example.com/image2.jpg' }],
    release_date: '2024-01-02',
    total_tracks: 10,
    album_type: 'single',
    external_urls: { spotify: 'https://spotify.com/album/2' },
  },
  {
    id: '3',
    name: 'Test Album 3 - No Image',
    artists: [{ name: 'Test Artist 3' }],
    images: [],
    release_date: '2024-01-03',
    total_tracks: 1,
    album_type: 'single',
    external_urls: { spotify: 'https://spotify.com/album/3' },
  },
];

export const mockArtists = [
  {
    id: '1',
    name: 'Test Artist 1',
    genres: ['rock', 'alternative'],
    images: [{ url: 'https://example.com/artist1.jpg' }],
    followers: { total: 1000000 },
    popularity: 85,
    external_urls: { spotify: 'https://spotify.com/artist/1' },
  },
  {
    id: '2',
    name: 'Test Artist 2',
    genres: ['pop', 'dance'],
    images: [{ url: 'https://example.com/artist2.jpg' }],
    followers: { total: 500000 },
    popularity: 72,
    external_urls: { spotify: 'https://spotify.com/artist/2' },
  },
  {
    id: '3',
    name: 'Test Artist 3 - No Image',
    genres: ['jazz'],
    images: [],
    followers: { total: 100000 },
    popularity: 45,
    external_urls: { spotify: 'https://spotify.com/artist/3' },
  },
];

export const mockTracks = [
  {
    id: '1',
    name: 'Test Track 1',
    artists: [{ name: 'Test Artist 1' }],
    album: {
      name: 'Test Album 1',
      images: [{ url: 'https://example.com/album1.jpg' }],
    },
    duration_ms: 180000,
    popularity: 82,
    external_urls: { spotify: 'https://spotify.com/track/1' },
  },
  {
    id: '2',
    name: 'Test Track 2',
    artists: [{ name: 'Test Artist 2' }],
    album: {
      name: 'Test Album 2',
      images: [{ url: 'https://example.com/album2.jpg' }],
    },
    duration_ms: 220000,
    popularity: 75,
    external_urls: { spotify: 'https://spotify.com/track/2' },
  },
];

export const mockFavorites = [
  {
    id: 'fav1',
    name: 'Test Album 1',
    artist: 'Test Artist 1',
    album: 'Test Album 1',
    type: 'album' as const,
    duration: 0,
    addedAt: new Date().toISOString(),
    imageUrl: 'https://example.com/image1.jpg',
    trackCount: 12,
  },
  {
    id: 'fav2',
    name: 'Test Track 1',
    artist: 'Test Artist 1',
    album: 'Test Album 1',
    type: 'track' as const,
    duration: 180000,
    addedAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: 'https://example.com/album1.jpg',
    popularity: 82,
  },
  {
    id: 'fav3',
    name: 'Test Artist 1',
    artist: 'Test Artist 1',
    album: 'Artist',
    type: 'artist' as const,
    duration: 0,
    addedAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: 'https://example.com/artist1.jpg',
    popularity: 85,
    genre: 'rock',
  },
];
