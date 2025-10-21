import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { spotifyService } from '../services/spotifyService';
import type { SearchFilters } from '../types';

export const useSpotifyArtists = (query: string, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['artists', query, page, limit],
    queryFn: () => spotifyService.searchArtists(query, limit, page * limit),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => ({
      artists: data.artists,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.total / limit),
        totalItems: data.total,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
        limit,
      },
    }),
  });
};

export const useSpotifyAlbums = (query: string, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['albums', query, page, limit],
    queryFn: () => spotifyService.searchAlbums(query, limit, page * limit),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSpotifyTracks = (query: string, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['tracks', query, page, limit],
    queryFn: () => spotifyService.searchTracks(query, limit, page * limit),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSpotifySearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => spotifyService.searchAll(filters),
    enabled: filters.query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSpotifyArtist = (id: string) => {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => spotifyService.getArtist(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useSpotifyArtistTopTracks = (id: string) => {
  return useQuery({
    queryKey: ['artist-top-tracks', id],
    queryFn: () => spotifyService.getArtistTopTracks(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useSpotifyArtistAlbums = (id: string, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['artist-albums', id, page, limit],
    queryFn: () => spotifyService.getArtistAlbums(id, limit, page * limit),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useSpotifyAlbum = (id: string) => {
  return useQuery({
    queryKey: ['album', id],
    queryFn: () => spotifyService.getAlbum(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useSpotifyAlbumTracks = (id: string) => {
  return useQuery({
    queryKey: ['album-tracks', id],
    queryFn: () => spotifyService.getAlbumTracks(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useSpotifyTrack = (id: string) => {
  return useQuery({
    queryKey: ['track', id],
    queryFn: () => spotifyService.getTrack(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useInfiniteSpotifyArtists = (query: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['artists-infinite', query, limit],
    queryFn: ({ pageParam = 0 }) =>
      spotifyService.searchArtists(query, limit, pageParam as number),
    enabled: query.length > 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.artists.length < limit) return undefined;
      return allPages.length * limit;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
