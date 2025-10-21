import React from 'react';
import { Play, Heart, ExternalLink } from 'lucide-react';
import type { SpotifyTrack } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface TrackListProps {
  tracks: SpotifyTrack[];
  onAddToFavorites: (track: SpotifyTrack) => void;
  isFavorite: (trackId: string) => boolean;
  showAlbum?: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onAddToFavorites,
  isFavorite,
  showAlbum = true,
}) => {
  const handlePlayTrack = (track: SpotifyTrack) => {
    if (track.preview_url) {
      const audio = new Audio(track.preview_url);
      audio.play().catch(console.error);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-500 rounded-xl shadow-sm border border-gray-200 dark:border-dark-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-600 border-b border-gray-200 dark:border-dark-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              {showAlbum && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Album
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Popularity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-300">
            {tracks.map((track, index) => (
              <tr
                key={track.id}
                className="hover:bg-gray-50 dark:hover:bg-dark-400 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                      {track.album?.images?.[0]?.url ? (
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={track.album.images[0].url}
                          alt={track.album.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {track.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {track.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {track.artists.map(artist => artist.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                {showAlbum && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {track.album?.name || 'Unknown Album'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 dark:bg-dark-300 rounded-full h-2 mr-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${track.popularity}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {track.popularity}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDuration(track.duration_ms)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {track.preview_url && (
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                        aria-label="Play preview"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onAddToFavorites(track)}
                      className={`transition-colors duration-200 ${
                        isFavorite(track.id)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                      }`}
                      aria-label={isFavorite(track.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(track.id) ? 'fill-current' : ''}`} />
                    </button>
                    {track.external_urls?.spotify && (
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                        aria-label="Open in Spotify"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
