import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Trash2, BarChart3, PieChart, TrendingUp, Clock } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useTranslation } from '../../hooks/useTranslation';
import { FavoriteItem } from '../../components/favorites/favorite-item';
import { SearchInput } from '../../components/ui/search-input';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import { FavoritesDistributionChart } from '../../components/charts/favorites-distribution-chart';
import { ArtistsFavoritesChart } from '../../components/charts/artists-favorites-chart';
import { DurationDistributionChart } from '../../components/charts/duration-distribution-chart';
import { FavoritesTimelineChart } from '../../components/charts/favorites-timeline-chart';
import type { UserFavorite } from '../../types';

export const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, removeFavorite, clearFavorites, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<UserFavorite['type'] | 'all'>('all');
  const [showCharts, setShowCharts] = useState(false);

  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    if (selectedType !== 'all') {
      filtered = filtered.filter(fav => fav.type === selectedType);
    }

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

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('navigation.favorites')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length === 0 
                ? 'Nenhum favorito adicionado ainda'
                : `${favorites.length} ${favorites.length === 1 ? 'favorito' : 'favoritos'} salvos`
              }
            </p>
          </motion.div>
          
          {favorites.length > 0 && (
            <motion.button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              Limpar todos
            </motion.button>
          )}
        </div>

        {/* Stats */}
        {favorites.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.div 
              className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {favoritesByType.all}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
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
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
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
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Charts Section */}
      {favorites.length > 0 && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
            >
              Análise dos Favoritos
            </motion.h2>
            <motion.button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4" />
              {showCharts ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
            </motion.button>
          </div>

          {showCharts && (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Distribution Chart */}
              <motion.div 
                className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Distribuição por Tipo
                  </h3>
                </div>
                <FavoritesDistributionChart favorites={favorites} />
              </motion.div>

              {/* Artists Chart */}
              <motion.div 
                className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Artistas Mais Favoritados
                  </h3>
                </div>
                <ArtistsFavoritesChart favorites={favorites} />
              </motion.div>

              {/* Duration Chart */}
              <motion.div 
                className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Distribuição de Duração
                  </h3>
                </div>
                <DurationDistributionChart favorites={favorites} />
              </motion.div>

              {/* Timeline Chart */}
              <motion.div 
                className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Evolução dos Favoritos
                  </h3>
                </div>
                <FavoritesTimelineChart favorites={favorites} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Filters and Search */}
      {favorites.length > 0 && (
        <motion.div 
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar favoritos..."
            className="max-w-md"
          />
          
          <motion.div 
            className="flex gap-2 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.3 }}
          >
            <motion.button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Todos ({favoritesByType.all})
            </motion.button>
            <motion.button
              onClick={() => setSelectedType('artist')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'artist'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
{t('sections.artists')} ({favoritesByType.artist})
            </motion.button>
            <motion.button
              onClick={() => setSelectedType('album')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'album'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
{t('sections.albums')} ({favoritesByType.album})
            </motion.button>
            <motion.button
              onClick={() => setSelectedType('track')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedType === 'track'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Músicas ({favoritesByType.track})
            </motion.button>
          </motion.div>
        </motion.div>
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
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
        >
          {filteredFavorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + (index * 0.1), duration: 0.3 }}
            >
              <FavoriteItem
                favorite={favorite}
                onRemove={handleRemoveFavorite}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
