import React from 'react';
import { Heart, Calendar, ExternalLink } from 'lucide-react';
import type { SpotifyAlbum } from '../../types';
import { formatDate } from '../../utils/formatters';

interface AlbumGridProps {
  albums: SpotifyAlbum[];
  onAddToFavorites: (album: SpotifyAlbum) => void;
  isFavorite: (albumId: string) => boolean;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  albums,
  onAddToFavorites,
  isFavorite,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album) => (
        <div
          key={album.id}
          className="group bg-white dark:bg-dark-500 rounded-xl shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          {/* Album Cover */}
          <div className="relative aspect-square overflow-hidden">
            {album.images?.[0]?.url ? (
              <img
                src={album.images[0].url}
                alt={album.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {album.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Favorite Button */}
            <button
              onClick={() => onAddToFavorites(album)}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isFavorite(album.id)
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-dark-600/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
              }`}
              aria-label={isFavorite(album.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite(album.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Album Info */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                {album.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {album.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>

            {/* Album Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(album.release_date)}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {album.total_tracks} track{album.total_tracks !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {album.album_type}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {album.external_urls?.spotify && (
                <a
                  href={album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                >
                  Open in Spotify
                </a>
              )}
              <a
                href={album.external_urls?.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-gray-300 dark:border-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-400 rounded-lg transition-colors duration-200"
                aria-label="Open in Spotify"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
