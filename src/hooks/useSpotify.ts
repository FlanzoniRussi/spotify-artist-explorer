import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { spotifyService } from '../services/spotifyService';
import type { SearchFilters } from '../types';

/**
 * Hook for searching artists on Spotify with pagination.
 *
 * Fetches artists matching a query string. Results are cached and revalidated
 * based on React Query's stale time configuration.
 *
 * IMPORTANT: The total count is fetched and cached only once per query.
 * When changing pages, only the results for that page are re-fetched.
 *
 * @param {string} query - Artist search query (must be non-empty)
 * @param {number} [page=0] - Page number for pagination (0-indexed)
 * @param {number} [limit=20] - Number of results per page
 * @returns {UseQueryResult} React Query object with artists data and pagination info
 *
 * @example
 * const { data, isLoading, error } = useSpotifyArtists('The Beatles', 0, 20);
 */
export const useSpotifyArtists = (query: string, page = 0, limit = 20) => {
  const {
    data: pageData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['artists', query, page, limit],
    queryFn: () => spotifyService.searchArtists(query, limit, page * limit),
    enabled: query.length > 0,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });

  const { data: firstPageData } = useQuery({
    queryKey: ['artists-total', query, limit],
    queryFn: () => spotifyService.searchArtists(query, limit, 0),
    enabled: query.length > 0,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });

  const total = firstPageData?.total ?? pageData?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: pageData
      ? {
          artists: pageData.artists,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            hasNext: page < totalPages - 1,
            hasPrevious: page > 0,
            limit,
          },
        }
      : undefined,
    isLoading,
    error,
    isFetching,
  };
};

/**
 * Hook for searching albums on Spotify with pagination.
 *
 * Fetches albums matching a query string. Results are cached and
 * revalidated based on React Query's stale time configuration.
 *
 * IMPORTANT: The total count is fetched and cached only once per query.
 * When changing pages, only the results for that page are re-fetched.
 *
 * @param {string} query - Album search query (must be non-empty)
 * @param {number} [page=0] - Page number for pagination (0-indexed)
 * @param {number} [limit=20] - Number of results per page
 * @returns {UseQueryResult} React Query object with albums data
 *
 * @example
 * const { data, isLoading } = useSpotifyAlbums('Thriller', 0, 20);
 */
export const useSpotifyAlbums = (query: string, page = 0, limit = 20) => {
  const {
    data: pageData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['albums', query, page, limit],
    queryFn: async () => {
      const response = await spotifyService.searchAlbums(
        query,
        limit,
        page * limit
      );
      return response;
    },
    enabled: query.length > 0,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });

  const { data: firstPageData } = useQuery({
    queryKey: ['albums-total', query, limit],
    queryFn: async () => {
      const response = await spotifyService.searchAlbums(query, limit, 0);
      return response;
    },
    enabled: query.length > 0,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });

  const total = firstPageData?.total ?? pageData?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: pageData
      ? {
          albums: pageData.albums,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            hasNext: page < totalPages - 1,
            hasPrevious: page > 0,
            limit,
          },
        }
      : undefined,
    isLoading,
    error,
    isFetching,
  };
};

/**
 * Hook for searching tracks on Spotify with pagination.
 *
 * Fetches tracks matching a query string. Results are cached and
 * revalidated based on React Query's stale time configuration.
 *
 * @param {string} query - Track search query (must be non-empty)
 * @param {number} [page=0] - Page number for pagination (0-indexed)
 * @param {number} [limit=20] - Number of results per page
 * @returns {UseQueryResult} React Query object with tracks data
 *
 * @example
 * const { data, isLoading } = useSpotifyTracks('Bohemian Rhapsody', 0, 20);
 */
export const useSpotifyTracks = (query: string, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['tracks', query, page, limit],
    queryFn: () => spotifyService.searchTracks(query, limit, page * limit),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for unified search across multiple content types (artists, albums, tracks).
 *
 * Performs a search using detailed filter parameters. Supports
 * specific search types and pagination.
 *
 * @param {SearchFilters} filters - Search filter parameters (query, type, limit, offset)
 * @returns {UseQueryResult} React Query object with combined search results
 *
 * @example
 * const { data } = useSpotifySearch({
 *   query: 'Pink Floyd',
 *   type: 'artist',
 *   limit: 20,
 *   offset: 0
 * });
 */
export const useSpotifySearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => spotifyService.searchAll(filters),
    enabled: filters.query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching a specific artist's details.
 *
 * Retrieves comprehensive artist information including bio, genres,
 * popularity, and follower count.
 *
 * @param {string} id - Spotify artist ID
 * @returns {UseQueryResult} React Query object with artist details
 *
 * @example
 * const { data: artist } = useSpotifyArtist('3WrFJ7ztbogyc2K8NB9Zyt');
 */
export const useSpotifyArtist = (id: string) => {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => spotifyService.getArtist(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for fetching an artist's top tracks.
 *
 * Gets the most popular/top tracks by a specific artist.
 *
 * @param {string} id - Spotify artist ID
 * @returns {UseQueryResult} React Query object with top tracks array
 *
 * @example
 * const { data } = useSpotifyArtistTopTracks('3WrFJ7ztbogyc2K8NB9Zyt');
 */
export const useSpotifyArtistTopTracks = (id: string) => {
  return useQuery({
    queryKey: ['artist-top-tracks', id],
    queryFn: () => spotifyService.getArtistTopTracks(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for fetching an artist's albums with pagination.
 *
 * Gets albums, singles, and compilations by a specific artist.
 *
 * @param {string} id - Spotify artist ID
 * @param {number} [page=0] - Page number for pagination (0-indexed)
 * @param {number} [limit=20] - Number of albums per page
 * @returns {UseQueryResult} React Query object with paginated albums
 *
 * @example
 * const { data } = useSpotifyArtistAlbums('3WrFJ7ztbogyc2K8NB9Zyt', 0, 20);
 */
export const useSpotifyArtistAlbums = (id: string, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['artist-albums', id, page, limit],
    queryFn: () => spotifyService.getArtistAlbums(id, limit, page * limit),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for fetching a specific album's details.
 *
 * Retrieves comprehensive album information including release date,
 * track count, and album artwork.
 *
 * @param {string} id - Spotify album ID
 * @returns {UseQueryResult} React Query object with album details
 *
 * @example
 * const { data: album } = useSpotifyAlbum('4m2880jivnjc4YLMAYIx00');
 */
export const useSpotifyAlbum = (id: string) => {
  return useQuery({
    queryKey: ['album', id],
    queryFn: () => spotifyService.getAlbum(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for fetching all tracks in a specific album.
 *
 * Gets the complete tracklist for an album with detailed track information.
 *
 * @param {string} id - Spotify album ID
 * @returns {UseQueryResult} React Query object with album tracks array
 *
 * @example
 * const { data } = useSpotifyAlbumTracks('4m2880jivnjc4YLMAYIx00');
 */
export const useSpotifyAlbumTracks = (id: string, albumName?: string) => {
  return useQuery({
    queryKey: ['album-tracks', id, albumName],
    queryFn: () => spotifyService.getAlbumTracks(id, albumName),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for fetching a specific track's details.
 *
 * Retrieves comprehensive track information including duration, popularity,
 * explicit flag, and audio preview URL.
 *
 * @param {string} id - Spotify track ID
 * @returns {UseQueryResult} React Query object with track details
 *
 * @example
 * const { data: track } = useSpotifyTrack('3n3Ppam7vgaVa1iaRUc9Lp');
 */
export const useSpotifyTrack = (id: string) => {
  return useQuery({
    queryKey: ['track', id],
    queryFn: () => spotifyService.getTrack(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for infinite scrolling artist search results.
 *
 * Uses React Query's infinite query to load artists progressively
 * as the user scrolls down. More efficient for large result sets.
 *
 * @param {string} query - Artist search query (must be non-empty)
 * @param {number} [limit=20] - Number of results per page
 * @returns {UseInfiniteQueryResult} React Query infinite query object
 *
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
 *   useInfiniteSpotifyArtists('The Beatles');
 *
 * return (
 *   <InfiniteScroll
 *     dataLength={data?.pages.flat().length || 0}
 *     next={fetchNextPage}
 *     hasMore={hasNextPage}
 *     loader={<Spinner />}
 *   >
 *     {data?.pages.map(page => ...)}
 *   </InfiniteScroll>
 * );
 * ```
 */
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
