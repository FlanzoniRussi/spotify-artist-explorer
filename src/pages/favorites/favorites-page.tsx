import React, { useState, useMemo } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useTranslation } from '../../hooks/useTranslation';
import { FavoriteItem } from '../../components/favorites/favorite-item';
import { SearchInput } from '../../components/ui/search-input';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import type { UserFavorite } from '../../types';

export const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, removeFavorite, clearFavorites, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<UserFavorite['type'] | 'all'>('all');

  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(fav => fav.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fav => 
        fav.name.toLowerCase().includes(query) ||
        fav.artist.toLowerCase().includes(query) ||
        fav.album.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [favorites, searchQuery, selectedType]);

  const favoritesByType = useMemo(() => {
    return {
      all: favorites.length,
      artist: favorites.filter(fav => fav.type === 'artist').length,
      album: favorites.filter(fav => fav.type === 'album').length,
      track: favorites.filter(fav => fav.type === 'track').length,
    };
  }, [favorites]);

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
      clearFavorites();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-dark-300 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded w-64 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('navigation.favorites')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length === 0 
                ? 'Nenhum favorito adicionado ainda'
                : `${favorites.length} ${favorites.length === 1 ? 'favorito' : 'favoritos'} salvos`
              }
            </p>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Limpar todos
            </button>
          )}
        </div>

        {/* Stats */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {favoritesByType.all}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('sections.artists')}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {favoritesByType.artist}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Á</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('sections.albums')}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {favoritesByType.album}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Músicas</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {favoritesByType.track}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      {favorites.length > 0 && (
        <div className="mb-8 space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar favoritos..."
            className="max-w-md"
          />
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
              Todos ({favoritesByType.all})
            </button>
            <button
              onClick={() => setSelectedType('artist')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'artist'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
{t('sections.artists')} ({favoritesByType.artist})
            </button>
            <button
              onClick={() => setSelectedType('album')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'album'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
{t('sections.albums')} ({favoritesByType.album})
            </button>
            <button
              onClick={() => setSelectedType('track')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'track'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
              Músicas ({favoritesByType.track})
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} className="text-gray-400 dark:text-gray-500" />}
          title="Nenhum favorito ainda"
          description="Adicione artistas, álbuns ou músicas aos seus favoritos para vê-los aqui."
          action={
            <a
              href="/"
              className="btn-primary"
            >
{t('navigation.artists')}
            </a>
          }
        />
      ) : filteredFavorites.length === 0 ? (
        <EmptyState
          icon={<Search size={48} className="text-gray-400 dark:text-gray-500" />}
          title="Nenhum resultado encontrado"
          description="Tente ajustar sua busca ou filtros para encontrar seus favoritos."
        />
      ) : (
        <div className="space-y-4">
          {filteredFavorites.map((favorite) => (
            <FavoriteItem
              key={favorite.id}
              favorite={favorite}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
