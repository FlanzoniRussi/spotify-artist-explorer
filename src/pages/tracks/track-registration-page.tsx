import React, { useState, useEffect } from 'react';
import { Music, CheckCircle, AlertCircle, Plus, List, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCustomTracks } from '../../hooks/useCustomTracks';
import { TrackRegistrationForm } from '../../components/forms/track-registration-form';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import type { CustomTrack } from '../../types';

export const TrackRegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const { customTracks, isLoading, addCustomTrack, clearCustomTracks, removeCustomTrack } = useCustomTracks();
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<CustomTrack | null>(null);


  const handleFormSuccess = (track: CustomTrack) => {
    console.log('handleFormSuccess called with track:', track);
    console.log('Current customTracks in handleFormSuccess:', customTracks);
    setSuccessMessage(t('forms:trackRegistration.success'));
    setShowForm(false); // Volta para a lista
    
    // Clear form draft after successful submission
    localStorage.removeItem('track-form-draft');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTrack(null);
    // Clear form draft when canceling
    localStorage.removeItem('track-form-draft');
  };

  const handleEditTrack = (track: CustomTrack) => {
    setEditingTrack(track);
    setShowForm(true);
  };

  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta música?')) {
      removeCustomTrack(trackId);
    }
  };

  const handleNewTrack = () => {
    setEditingTrack(null);
    setShowForm(true);
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja remover todas as músicas cadastradas?')) {
      clearCustomTracks();
    }
  };

  const formatDuration = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

  console.log('Render - showForm:', showForm, 'customTracks.length:', customTracks.length, 'isLoading:', isLoading);
  console.log('customTracks array:', customTracks);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <LoadingSkeleton className="h-8 w-64 mb-2" />
          <LoadingSkeleton className="h-4 w-96" />
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
              {t('forms:trackRegistration.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('forms:trackRegistration.subtitle')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={showForm ? () => setShowForm(false) : handleNewTrack}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              {showForm ? 'Ver Lista' : 'Nova Música'}
            </button>
            
            {customTracks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <AlertCircle className="w-4 h-4" />
                Limpar Tudo
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-green-800 dark:text-green-200">{successMessage}</span>
          </div>
        )}

        {/* Stats */}
        {customTracks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {customTracks.length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lançadas</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {customTracks.filter(track => track.isReleased).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {customTracks.filter(track => !track.isReleased).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gêneros</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {new Set(customTracks.map(track => track.genre)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form or List */}
      {showForm ? (
        <div className="bg-white dark:bg-dark-500 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-300">
          <TrackRegistrationForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            editingTrack={editingTrack}
            initialData={editingTrack ? {
              name: editingTrack.name,
              artist: editingTrack.artist,
              album: editingTrack.album,
              year: editingTrack.year,
              genre: editingTrack.genre,
              duration: editingTrack.duration,
              isReleased: editingTrack.isReleased,
            } : undefined}
          />
        </div>
      ) : (
        <div>
          {customTracks.length === 0 ? (
            <EmptyState
              icon={<Music size={48} className="text-gray-400 dark:text-gray-500" />}
              title="Nenhuma música cadastrada"
              description="Comece adicionando sua primeira música personalizada."
              action={
                <button
                  onClick={handleNewTrack}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeira Música
                </button>
              }
            />
          ) : (
            <div className="space-y-4">
              {customTracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-dark-500 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-4 h-4 text-primary-500" />
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          track.isReleased
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {track.isReleased ? 'Lançada' : 'Pendente'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {track.name}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium">Artista:</span> {track.artist || 'N/A'}</p>
                        <p><span className="font-medium">Álbum:</span> {track.album || 'N/A'}</p>
                        <p><span className="font-medium">Gênero:</span> {track.genre}</p>
                        <p><span className="font-medium">Ano:</span> {track.year}</p>
                        <p><span className="font-medium">Duração:</span> {formatDuration(track.duration.minutes, track.duration.seconds)}</p>
                        <p><span className="font-medium">Cadastrada:</span> {formatDate(track.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditTrack(track)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        aria-label="Editar música"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        aria-label="Remover música"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
