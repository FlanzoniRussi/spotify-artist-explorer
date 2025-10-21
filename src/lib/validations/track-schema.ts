import { z } from 'zod';

export const trackSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must have at least 2 characters')
    .max(100, 'Name must have at most 100 characters'),
  
  artist: z
    .string()
    .min(1, 'Artist is required')
    .min(2, 'Artist must have at least 2 characters')
    .max(100, 'Artist must have at most 100 characters'),
  
  album: z
    .string()
    .min(1, 'Album is required')
    .min(2, 'Album must have at least 2 characters')
    .max(100, 'Album must have at most 100 characters'),
  
  year: z
    .number()
    .int('Year must be an integer')
    .min(1900, 'Year must be greater than 1900')
    .max(new Date().getFullYear(), 'Year cannot be greater than current year'),
  
  genre: z
    .string()
    .min(1, 'Genre is required')
    .min(2, 'Genre must have at least 2 characters')
    .max(50, 'Genre must have at most 50 characters'),
  
  duration: z.object({
    minutes: z
      .number()
      .int('Minutes must be an integer')
      .min(0, 'Minutes must be at least 0')
      .max(59, 'Minutes must be at most 59'),
    seconds: z
      .number()
      .int('Seconds must be an integer')
      .min(0, 'Seconds must be at least 0')
      .max(59, 'Seconds must be at most 59'),
  }).refine(
    (duration) => duration.minutes > 0 || duration.seconds > 0,
    'Duration must be greater than 0'
  ),
  
  isReleased: z.boolean(),
});

export type TrackFormData = z.infer<typeof trackSchema>;

// Gêneros musicais disponíveis
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
