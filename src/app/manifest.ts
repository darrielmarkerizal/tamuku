import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tamuku — Teman Haid & TTD',
    short_name: 'Tamuku',
    description: 'Pelacak siklus haid dan Tablet Tambah Darah untuk siswi SMP.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff0f5',
    theme_color: '#ff3d8a',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
