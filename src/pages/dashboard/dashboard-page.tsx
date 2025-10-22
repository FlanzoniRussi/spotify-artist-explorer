import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Music, 
  Heart, 
  Calendar,
  Activity,
  Target,
  Star
} from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useCustomTracks } from '../../hooks/useCustomTracks';
import { FavoritesDistributionChart } from '../../components/charts/favorites-distribution-chart';
import { ArtistsFavoritesChart } from '../../components/charts/artists-favorites-chart';
import { GenreDistributionChart } from '../../components/charts/genre-distribution-chart';
import { ReleaseStatusChart } from '../../components/charts/release-status-chart';
import { FavoritesTimelineChart } from '../../components/charts/favorites-timeline-chart';
import { TracksTimelineChart } from '../../components/charts/tracks-timeline-chart';

export const DashboardPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { customTracks } = useCustomTracks();

  const analytics = useMemo(() => {
    const totalFavorites = favorites.length;
    const totalTracks = customTracks.length;
    const releasedTracks = customTracks.filter(track => track.isReleased).length;
    const uniqueGenres = new Set(customTracks.map(track => track.genre)).size;
    const uniqueArtists = new Set(favorites.map(fav => fav.artist)).size;
    
    const diversityScore = Math.min(100, (uniqueGenres + uniqueArtists) * 5);
    
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentFavorites = favorites.filter(fav => new Date(fav.addedAt) > lastWeek).length;
    const recentTracks = customTracks.filter(track => new Date(track.createdAt) > lastWeek).length;
    const activityScore = Math.min(100, (recentFavorites + recentTracks) * 10);

    return {
      totalFavorites,
      totalTracks,
      releasedTracks,
      uniqueGenres,
      uniqueArtists,
      diversityScore,
      activityScore,
      recentActivity: recentFavorites + recentTracks
    };
  }, [favorites, customTracks]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral da sua atividade musical e preferências
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Favoritos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalFavorites}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Music className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Músicas Cadastradas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalTracks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diversidade Musical</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.diversityScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Atividade Recente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.activityScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Favorites Distribution */}
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Distribuição de Favoritos
            </h3>
          </div>
          {favorites.length > 0 ? (
            <FavoritesDistributionChart favorites={favorites} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Nenhum favorito para visualizar</p>
            </div>
          )}
        </div>

        {/* Genre Distribution */}
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gêneros Favoritos
            </h3>
          </div>
          {customTracks.length > 0 ? (
            <GenreDistributionChart tracks={customTracks} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Nenhuma música cadastrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Favorites Timeline */}
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Evolução dos Favoritos
            </h3>
          </div>
          {favorites.length > 0 ? (
            <FavoritesTimelineChart favorites={favorites} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Nenhum favorito para visualizar</p>
            </div>
          )}
        </div>

        {/* Tracks Timeline */}
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Evolução do Cadastro
            </h3>
          </div>
          {customTracks.length > 0 ? (
            <TracksTimelineChart tracks={customTracks} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Nenhuma música cadastrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Artists */}
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Artistas Mais Favoritados
            </h3>
          </div>
          {favorites.length > 0 ? (
            <ArtistsFavoritesChart favorites={favorites} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Nenhum favorito para visualizar</p>
            </div>
          )}
        </div>

        {/* Release Status */}
        <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status de Lançamento
            </h3>
          </div>
          {customTracks.length > 0 ? (
            <ReleaseStatusChart tracks={customTracks} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Nenhuma música cadastrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
