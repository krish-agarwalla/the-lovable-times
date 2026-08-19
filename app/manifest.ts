// app/manifest.ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/supabase/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | ${siteConfig.legalName}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F1E8',
    theme_color: '#8E1F2D',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}