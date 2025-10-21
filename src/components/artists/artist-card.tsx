import React from 'react';
import { Heart, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SpotifyArtist } from '../../types';

interface ArtistCardProps {
  artist: SpotifyArtist;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  isFavorite,
  onToggleFavorite,
}) => {
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPopularityColor = (popularity: number): string => {
    if (popularity >= 80) return 'text-green-600 dark:text-green-400';
    if (popularity >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (popularity >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPopularityLabel = (popularity: number): string => {
    if (popularity >= 80) return 'Very Popular';
    if (popularity >= 60) return 'Popular';
    if (popularity >= 40) return 'Moderate';
    return 'Emerging';
  };

  return (
    <div className="group bg-white dark:bg-dark-500 rounded-xl shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Artist Image */}
      <div className="relative aspect-square overflow-hidden">
        {artist.images?.[0]?.url ? (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {artist.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/80 dark:bg-dark-600/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Artist Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {artist.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {artist.genres?.slice(0, 2).join(', ') || 'Various genres'}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              <span>{formatFollowers(artist.followers.total)} followers</span>
            </div>
            <div className={`flex items-center text-sm font-medium ${getPopularityColor(artist.popularity)}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{artist.popularity}%</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {getPopularityLabel(artist.popularity)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/artist/${artist.id}`}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
          >
            View Details
          </Link>
          {artist.external_urls?.spotify && (
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-gray-300 dark:border-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-400 rounded-lg transition-colors duration-200"
              aria-label="Open in Spotify"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
