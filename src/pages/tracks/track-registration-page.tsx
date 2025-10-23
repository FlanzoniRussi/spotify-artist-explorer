import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Music,
  CheckCircle,
  AlertCircle,
  Plus,
  List,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useContext } from 'react';
import { CustomTracksContext } from '../../contexts/custom-tracks-context';
import { CustomTrackItemWithRating } from '../../components/tracks/custom-track-item-with-rating';
import { TrackRegistrationForm } from '../../components/forms/track-registration-form';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { GenreDistributionChart } from '../../components/charts/genre-distribution-chart';
import { ReleaseStatusChart } from '../../components/charts/release-status-chart';
import { YearDistributionChart } from '../../components/charts/year-distribution-chart';
import { TracksTimelineChart } from '../../components/charts/tracks-timeline-chart';
import type { CustomTrack } from '../../types';

export const TrackRegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const { customTracks, isLoading, clearCustomTracks, removeCustomTrack } =
    useContext(CustomTracksContext)!;
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<CustomTrack | null>(null);
  const [showCharts, setShowCharts] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleFormSuccess = () => {
    setSuccessMessage(t('forms:trackRegistration.success'));
    setShowForm(false);

    localStorage.removeItem('track-form-draft');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTrack(null);
    localStorage.removeItem('track-form-draft');
  };

  const handleEditTrack = (track: CustomTrack) => {
    setEditingTrack(track);
    setShowForm(true);
  };

  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm(t('tracks:dialogs.deleteTrack'))) {
      removeCustomTrack(trackId);
    }
  };

  const handleNewTrack = () => {
    setEditingTrack(null);
    setShowForm(true);
  };

  const handleClearAll = () => {
    clearCustomTracks();
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <LoadingSkeleton className='h-8 w-64 mb-2' />
          <LoadingSkeleton className='h-4 w-96' />
        </div>
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton key={index} className='h-32' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              {t('forms:trackRegistration.title')}
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              {t('forms:trackRegistration.subtitle')}
            </p>
          </div>

          <div className='flex gap-3'>
            {/* Only show "+ Nova Música" button when there are tracks */}
            {customTracks.length > 0 && (
              <motion.button
                onClick={showForm ? () => setShowForm(false) : handleNewTrack}
                className='flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className='w-4 h-4 flex-shrink-0' />
                <span>
                  {showForm
                    ? t('tracks:buttons.showList')
                    : t('tracks:buttons.newTrack')}
                </span>
              </motion.button>
            )}

            {customTracks.length > 0 && (
              <motion.button
                onClick={() => setShowClearDialog(true)}
                className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AlertCircle className='w-4 h-4 flex-shrink-0' />
                <span>{t('tracks:buttons.clearAll')}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className='mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center'>
            <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400 mr-3' />
            <span className='text-green-800 dark:text-green-200'>
              {successMessage}
            </span>
          </div>
        )}

        {/* Stats */}
        {customTracks.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
            <div className='bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center gap-2'>
                <Music className='w-5 h-5 text-primary-500' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('tracks:stats.total')}
                  </p>
                  <p className='text-xl font-bold text-gray-900 dark:text-white'>
                    {customTracks.length}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('tracks:stats.released')}
                  </p>
                  <p className='text-xl font-bold text-gray-900 dark:text-white'>
                    {
                      customTracks.filter(
                        (track: CustomTrack) => track.isReleased
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center gap-2'>
                <AlertCircle className='w-5 h-5 text-yellow-500' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('tracks:stats.pending')}
                  </p>
                  <p className='text-xl font-bold text-gray-900 dark:text-white'>
                    {
                      customTracks.filter(
                        (track: CustomTrack) => !track.isReleased
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center gap-2'>
                <List className='w-5 h-5 text-blue-500' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('tracks:stats.genres')}
                  </p>
                  <p className='text-xl font-bold text-gray-900 dark:text-white'>
                    {
                      new Set(
                        customTracks.map((track: CustomTrack) => track.genre)
                      ).size
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {customTracks.length > 0 && (
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className='flex items-center justify-between mb-6'>
            <motion.h2
              className='text-2xl font-bold text-gray-900 dark:text-white'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {t('tracks:analysis.title')}
            </motion.h2>
            <motion.button
              onClick={() => setShowCharts(!showCharts)}
              className='flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className='w-4 h-4' />
              {showCharts
                ? t('tracks:analysis.hide')
                : t('tracks:analysis.show')}
            </motion.button>
          </div>

          {showCharts && (
            <motion.div
              className='grid grid-cols-1 lg:grid-cols-2 gap-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Genre Distribution Chart */}
              <motion.div
                className='bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <BarChart3 className='w-5 h-5 text-blue-500' />
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {t('tracks:analysis.genreDistribution')}
                  </h3>
                </div>
                <GenreDistributionChart tracks={customTracks} />
              </motion.div>

              {/* Release Status Chart */}
              <motion.div
                className='bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <PieChart className='w-5 h-5 text-green-500' />
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {t('tracks:analysis.releaseStatus')}
                  </h3>
                </div>
                <ReleaseStatusChart tracks={customTracks} />
              </motion.div>

              {/* Year Distribution Chart */}
              <motion.div
                className='bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <Calendar className='w-5 h-5 text-purple-500' />
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {t('tracks:analysis.yearDistribution')}
                  </h3>
                </div>
                <YearDistributionChart tracks={customTracks} />
              </motion.div>

              {/* Timeline Chart */}
              <motion.div
                className='bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <TrendingUp className='w-5 h-5 text-orange-500' />
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {t('tracks:analysis.evolution')}
                  </h3>
                </div>
                <TracksTimelineChart tracks={customTracks} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Form or List */}
      {showForm ? (
        <div className='bg-white dark:bg-dark-500 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-300'>
          <TrackRegistrationForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            editingTrack={editingTrack}
            initialData={
              editingTrack
                ? {
                    name: editingTrack.name,
                    artist: editingTrack.artist,
                    album: editingTrack.album,
                    year: editingTrack.year,
                    genre: editingTrack.genre,
                    duration: editingTrack.duration,
                    isReleased: editingTrack.isReleased,
                  }
                : undefined
            }
          />
        </div>
      ) : (
        <div>
          {customTracks.length === 0 ? (
            <EmptyState
              icon={
                <Music size={48} className='text-gray-400 dark:text-gray-500' />
              }
              title={t('tracks:empty.title')}
              description={t('tracks:empty.description')}
              action={
                <motion.button
                  onClick={handleNewTrack}
                  className='flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className='w-5 h-5' />
                  <span>{t('tracks:buttons.registerFirst')}</span>
                </motion.button>
              }
            />
          ) : (
            <div className='space-y-4'>
              {customTracks.map((track: CustomTrack) => (
                <CustomTrackItemWithRating
                  key={track.id}
                  track={track}
                  onEdit={handleEditTrack}
                  onDelete={handleDeleteTrack}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('tracks:dialogs.clearAllTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('tracks:dialogs.clearAllDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleClearAll}>
            {t('tracks:dialogs.clearAllConfirm')}
          </AlertDialogAction>
          <AlertDialogCancel onClick={() => setShowClearDialog(false)}>
            {t('tracks:dialogs.cancel')}
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
