import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nobug Rewards',
    short_name: 'Rewards',
    description: 'Recompensas e ecossistema de parceiros.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6f6',
    theme_color: '#7c0a18',
    icons: [{ src: '/brand/rewards.webp', sizes: 'any', type: 'image/webp' }],
  };
}
