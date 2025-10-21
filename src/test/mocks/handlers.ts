import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.spotify.com/v1/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const type = url.searchParams.get('type');

    if (type === 'artist') {
      return HttpResponse.json({
        artists: {
          href: 'https://api.spotify.com/v1/search?query=test&type=artist&offset=0&limit=20',
          items: [
            {
              external_urls: {
                spotify: 'https://open.spotify.com/artist/1test',
              },
              followers: {
                href: null,
                total: 1000000,
              },
              genres: ['pop', 'rock'],
              href: 'https://api.spotify.com/v1/artists/1test',
              id: '1test',
              images: [
                {
                  height: 640,
                  url: 'https://i.scdn.co/image/test1',
                  width: 640,
                },
              ],
              name: 'Test Artist',
              popularity: 80,
              type: 'artist',
              uri: 'spotify:artist:1test',
            },
          ],
          limit: 20,
          next: null,
          offset: 0,
          previous: null,
          total: 1,
        },
      });
    }

    return HttpResponse.json({});
  }),

  http.get('https://api.spotify.com/v1/artists/:id', ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      external_urls: {
        spotify: `https://open.spotify.com/artist/${id}`,
      },
      followers: {
        href: null,
        total: 1000000,
      },
      genres: ['pop', 'rock'],
      href: `https://api.spotify.com/v1/artists/${id}`,
      id: id as string,
      images: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/test1',
          width: 640,
        },
      ],
      name: 'Test Artist',
      popularity: 80,
      type: 'artist',
      uri: `spotify:artist:${id}`,
    });
  }),

  http.get('https://api.spotify.com/v1/artists/:id/top-tracks', ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      tracks: [
        {
          album: {
            album_type: 'album',
            artists: [
              {
                external_urls: {
                  spotify: `https://open.spotify.com/artist/${id}`,
                },
                href: `https://api.spotify.com/v1/artists/${id}`,
                id: id as string,
                name: 'Test Artist',
                type: 'artist',
                uri: `spotify:artist:${id}`,
              },
            ],
            external_urls: {
              spotify: 'https://open.spotify.com/album/1test',
            },
            href: 'https://api.spotify.com/v1/albums/1test',
            id: '1test',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/test1',
                width: 640,
              },
            ],
            name: 'Test Album',
            release_date: '2023-01-01',
            release_date_precision: 'day',
            total_tracks: 10,
            type: 'album',
            uri: 'spotify:album:1test',
          },
          artists: [
            {
              external_urls: {
                spotify: `https://open.spotify.com/artist/${id}`,
              },
              href: `https://api.spotify.com/v1/artists/${id}`,
              id: id as string,
              name: 'Test Artist',
              type: 'artist',
              uri: `spotify:artist:${id}`,
            },
          ],
          disc_number: 1,
          duration_ms: 180000,
          explicit: false,
          external_ids: {
            isrc: 'USRC17607839',
          },
          external_urls: {
            spotify: 'https://open.spotify.com/track/1test',
          },
          href: 'https://api.spotify.com/v1/tracks/1test',
          id: '1test',
          is_local: false,
          name: 'Test Track',
          popularity: 70,
          preview_url: 'https://p.scdn.co/mp3-preview/test',
          track_number: 1,
          type: 'track',
          uri: 'spotify:track:1test',
        },
      ],
    });
  }),

  http.get('https://api.spotify.com/v1/artists/:id/albums', ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      href: `https://api.spotify.com/v1/artists/${id}/albums?offset=0&limit=20`,
      items: [
        {
          album_type: 'album',
          artists: [
            {
              external_urls: {
                spotify: `https://open.spotify.com/artist/${id}`,
              },
              href: `https://api.spotify.com/v1/artists/${id}`,
              id: id as string,
              name: 'Test Artist',
              type: 'artist',
              uri: `spotify:artist:${id}`,
            },
          ],
          external_urls: {
            spotify: 'https://open.spotify.com/album/1test',
          },
          href: 'https://api.spotify.com/v1/albums/1test',
          id: '1test',
          images: [
            {
              height: 640,
              url: 'https://i.scdn.co/image/test1',
              width: 640,
            },
          ],
          name: 'Test Album',
          release_date: '2023-01-01',
          release_date_precision: 'day',
          total_tracks: 10,
          type: 'album',
          uri: 'spotify:album:1test',
        },
      ],
      limit: 20,
      next: null,
      offset: 0,
      previous: null,
      total: 1,
    });
  }),
];
