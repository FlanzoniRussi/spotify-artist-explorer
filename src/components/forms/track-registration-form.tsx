import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Music, Save, RotateCcw, Calendar, Clock, User, Disc } from 'lucide-react';
import { trackSchema, MUSIC_GENRES, type TrackFormData } from '../../lib/validations/track-schema';
import { useTranslation } from '../../hooks/useTranslation';
import { useCustomTracks } from '../../contexts/custom-tracks-context';
import { DatePicker } from '../ui/date-picker';
import type { CustomTrack } from '../../types';

interface TrackRegistrationFormProps {
  onSuccess?: (track: CustomTrack) => void;
  onCancel?: () => void;
  initialData?: Partial<TrackFormData>;
  editingTrack?: CustomTrack | null;
}

export const TrackRegistrationForm: React.FC<TrackRegistrationFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  editingTrack,
}) => {
  const { t } = useTranslation();
  const { addCustomTrack, updateCustomTrack } = useCustomTracks();

  /**
   * Traduz mensagens de erro que são chaves i18n
   */
  const translateErrorMessage = (message: string): string => {
    // Se a mensagem é uma chave i18n (começa com 'forms:'), traduz
    if (message?.startsWith('forms:')) {
      return t(message);
    }
    return message;
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
  } = useForm<TrackFormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      name: initialData?.name || '',
      artist: initialData?.artist || '',
      album: initialData?.album || '',
      year: initialData?.year || new Date().getFullYear(),
      genre: initialData?.genre || '',
      duration: initialData?.duration || { minutes: 0, seconds: 0 },
      isReleased: initialData?.isReleased || false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch((value) => {
      try {
        localStorage.setItem('track-form-draft', JSON.stringify(value));
      } catch {
        // Silent fail
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    try {
      const draft = localStorage.getItem('track-form-draft');
      if (draft && !initialData && editingTrack) {
        const parsedDraft = JSON.parse(draft);
        Object.entries(parsedDraft).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as keyof TrackFormData, value as TrackFormData[keyof TrackFormData]);
          }
        });
      }
    } catch {
      // Silent fail
    }
  }, [setValue, initialData, editingTrack]);

  const onSubmit = async (data: TrackFormData) => {
    try {
      const trackData = {
        name: data.name,
        artist: data.artist,
        album: data.album,
        year: data.year,
        genre: data.genre,
        duration: {
          minutes: data.duration.minutes,
          seconds: data.duration.seconds,
        },
        isReleased: data.isReleased,
      };

      let result;
      if (editingTrack) {
        updateCustomTrack(editingTrack.id, trackData);
        result = { ...editingTrack, ...trackData };
      } else {
        result = addCustomTrack(trackData);
      }
      
      localStorage.removeItem('track-form-draft');
      reset();
      onSuccess?.(result);
    } catch {
      // Silent fail
    }
  };

  const handleReset = () => {
    reset();
    localStorage.removeItem('track-form-draft');
  };

  useEffect(() => {
    if (!editingTrack && !initialData) {
      localStorage.removeItem('track-form-draft');
    }
  }, [editingTrack, initialData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Track Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Music className="inline w-4 h-4 mr-2" />
          {t('forms:trackRegistration.fields.name.label')}
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder={t('forms:trackRegistration.fields.name.placeholder')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
            errors.name
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {translateErrorMessage(errors.name.message || '')}
          </p>
        )}
      </div>

      {/* Artist */}
      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <User className="inline w-4 h-4 mr-2" />
          {t('forms:trackRegistration.fields.artist.label')}
        </label>
        <input
          {...register('artist')}
          type="text"
          id="artist"
          placeholder={t('forms:trackRegistration.fields.artist.placeholder')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
            errors.artist
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
          }`}
        />
        {errors.artist && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {translateErrorMessage(errors.artist.message || '')}
          </p>
        )}
      </div>

      {/* Album */}
      <div>
        <label htmlFor="album" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Disc className="inline w-4 h-4 mr-2" />
          {t('forms:trackRegistration.fields.album.label')}
        </label>
        <input
          {...register('album')}
          type="text"
          id="album"
          placeholder={t('forms:trackRegistration.fields.album.placeholder')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
            errors.album
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
          }`}
        />
        {errors.album && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {translateErrorMessage(errors.album.message || '')}
          </p>
        )}
      </div>

      {/* Year and Genre Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            {t('forms:trackRegistration.fields.year.label')}
          </label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder={t('forms:trackRegistration.fields.year.placeholder')}
                error={!!errors.year}
              />
            )}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {translateErrorMessage(errors.year.message || '')}
            </p>
          )}
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('forms:trackRegistration.fields.genre.label')}
          </label>
          <select
            {...register('genre')}
            id="genre"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
              errors.genre
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
            }`}
          >
            <option value="">{t('forms:trackRegistration.fields.genre.placeholder')}</option>
            {MUSIC_GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genre && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {translateErrorMessage(errors.genre.message || '')}
            </p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration-minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="inline w-4 h-4 mr-2" />
            {t('forms:trackRegistration.fields.duration.minutes')}
          </label>
          <input
            {...register('duration.minutes', { valueAsNumber: true })}
            type="number"
            id="duration-minutes"
            min="0"
            max="59"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
              errors.duration?.minutes
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
            }`}
          />
          {errors.duration?.minutes && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {translateErrorMessage(errors.duration.minutes.message || '')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="duration-seconds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('forms:trackRegistration.fields.duration.seconds')}
          </label>
          <input
            {...register('duration.seconds', { valueAsNumber: true })}
            type="number"
            id="duration-seconds"
            min="0"
            max="59"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
              errors.duration?.seconds
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
            }`}
          />
          {errors.duration?.seconds && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {translateErrorMessage(errors.duration.seconds.message || '')}
            </p>
          )}
        </div>
      </div>

      {errors.duration?.root && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {translateErrorMessage(errors.duration.root.message || '')}
        </p>
      )}

      {/* Release Status */}
      <div className="flex items-center space-x-3">
        <input
          {...register('isReleased')}
          type="checkbox"
          id="isReleased"
          className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
        />
        <label htmlFor="isReleased" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          {t('forms:trackRegistration.fields.isReleased.label')}
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {t('forms:trackRegistration.buttons.save')}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t('forms:trackRegistration.buttons.reset')}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-300 dark:border-dark-300 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors duration-200"
          >
            {t('forms:trackRegistration.buttons.cancel')}
          </button>
        )}
      </div>
    </form>
  );
};
