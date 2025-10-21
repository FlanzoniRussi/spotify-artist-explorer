import React from 'react';
import { Heart, Music, Users, Clock, Calendar } from 'lucide-react';
import type { UserFavorite } from '../../types';

interface FavoriteItemProps {
  favorite: UserFavorite;
  onRemove: (id: string) => void;
}

export const FavoriteItem: React.FC<FavoriteItemProps> = ({
  favorite,
  onRemove,
}) => {
  const formatDuration = (durationMs: number): string => {
    if (durationMs === 0) return 'N/A';
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: UserFavorite['type']) => {
    switch (type) {
      case 'artist':
        return <Users className="w-4 h-4" />;
      case 'album':
        return <Music className="w-4 h-4" />;
      case 'track':
        return <Music className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: UserFavorite['type']): string => {
    switch (type) {
      case 'artist':
        return 'Artista';
      case 'album':
        return 'Álbum';
      case 'track':
        return 'Música';
      default:
        return 'Item';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-500 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon(favorite.type)}
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full">
              {getTypeLabel(favorite.type)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {favorite.name}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p><span className="font-medium">Artista:</span> {favorite.artist}</p>
            {favorite.type !== 'artist' && (
              <p><span className="font-medium">Álbum:</span> {favorite.album}</p>
            )}
            {favorite.type === 'track' && favorite.duration > 0 && (
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">Duração:</span> {formatDuration(favorite.duration)}
              </p>
            )}
            <p className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">Adicionado:</span> {formatDate(favorite.addedAt)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onRemove(favorite.id)}
          className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
          aria-label="Remover dos favoritos"
        >
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};
