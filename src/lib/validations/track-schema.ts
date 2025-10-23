import { z } from 'zod';

/**
 * Track validation schema com mensagens de erro genéricas
 * As mensagens serão traduzidas no component usando a chave i18n
 */
export const trackSchema = z.object({
  name: z
    .string()
    .min(1, 'forms:trackRegistration.fields.name.required')
    .min(2, 'forms:trackRegistration.fields.name.minLength')
    .max(100, 'forms:trackRegistration.fields.name.maxLength'),
  
  artist: z
    .string()
    .min(1, 'forms:trackRegistration.fields.artist.required')
    .min(2, 'forms:trackRegistration.fields.artist.minLength')
    .max(100, 'forms:trackRegistration.fields.artist.maxLength'),
  
  album: z
    .string()
    .min(1, 'forms:trackRegistration.fields.album.required')
    .min(2, 'forms:trackRegistration.fields.album.minLength')
    .max(100, 'forms:trackRegistration.fields.album.maxLength'),
  
  year: z
    .number()
    .int('forms:trackRegistration.fields.year.integer')
    .min(1900, 'forms:trackRegistration.fields.year.min')
    .max(new Date().getFullYear(), 'forms:trackRegistration.fields.year.max'),
  
  genre: z
    .string()
    .min(1, 'forms:trackRegistration.fields.genre.required')
    .min(2, 'forms:trackRegistration.fields.genre.minLength')
    .max(50, 'forms:trackRegistration.fields.genre.maxLength'),
  
  duration: z.object({
    minutes: z
      .number()
      .int('forms:trackRegistration.fields.duration.minutesInteger')
      .min(0, 'forms:trackRegistration.fields.duration.minutesMin')
      .max(59, 'forms:trackRegistration.fields.duration.minutesMax'),
    seconds: z
      .number()
      .int('forms:trackRegistration.fields.duration.secondsInteger')
      .min(0, 'forms:trackRegistration.fields.duration.secondsMin')
      .max(59, 'forms:trackRegistration.fields.duration.secondsMax'),
  }).refine(
    (duration) => duration.minutes > 0 || duration.seconds > 0,
    'forms:trackRegistration.fields.duration.minDuration'
  ),
  
  isReleased: z.boolean(),
});

export type TrackFormData = z.infer<typeof trackSchema>;
export const MUSIC_GENRES = [
  'Pop',
  'Rock',
  'Hip Hop',
  'R&B',
  'Country',
  'Electronic',
  'Jazz',
  'Classical',
  'Reggae',
  'Blues',
  'Folk',
  'Alternative',
  'Indie',
  'Punk',
  'Metal',
  'Funk',
  'Soul',
  'Gospel',
  'Latin',
  'World',
  'Other'
] as const;

export type MusicGenre = typeof MUSIC_GENRES[number];
