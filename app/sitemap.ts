// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/supabase/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}