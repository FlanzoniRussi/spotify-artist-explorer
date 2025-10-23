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

  const watchedDuration = watch('duration');

  useEffect(() => {
    const subscription = watch((value) => {
      try {
        localStorage.setItem('track-form-draft', JSON.stringify(value));
      } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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

  const formatDuration = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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
            {errors.name.message}
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
            {errors.artist.message}
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
            {errors.album.message}
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
              {errors.year.message}
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
              {errors.genre.message}
            </p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Clock className="inline w-4 h-4 mr-2" />
          {t('forms:trackRegistration.fields.duration.label')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minutes" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('forms:trackRegistration.fields.duration.minutes')}
            </label>
            <input
              {...register('duration.minutes', { valueAsNumber: true })}
              type="number"
              id="minutes"
              min="0"
              max="59"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                errors.duration?.minutes
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
              }`}
            />
            {errors.duration?.minutes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.duration.minutes.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="seconds" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('forms:trackRegistration.fields.duration.seconds')}
            </label>
            <input
              {...register('duration.seconds', { valueAsNumber: true })}
              type="number"
              id="seconds"
              min="0"
              max="59"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                errors.duration?.seconds
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
              }`}
            />
            {errors.duration?.seconds && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.duration.seconds.message}
              </p>
            )}
          </div>
        </div>
        {watchedDuration && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {formatDuration(watchedDuration.minutes, watchedDuration.seconds)}
          </p>
        )}
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.duration.message}
          </p>
        )}
      </div>

      {/* Release Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('forms:trackRegistration.fields.isReleased.label')}
        </label>
        <Controller
          name="isReleased"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('forms:trackRegistration.fields.isReleased.yes')}
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('forms:trackRegistration.fields.isReleased.no')}
                </span>
              </label>
            </div>
          )}
        />
        {errors.isReleased && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.isReleased.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-dark-300">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? t('common.loading') : t('forms:trackRegistration.buttons.save')}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('forms:trackRegistration.buttons.reset')}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 dark:border-dark-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-400 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {t('forms:trackRegistration.buttons.cancel')}
          </button>
        )}
      </div>
    </form>
  );
};
