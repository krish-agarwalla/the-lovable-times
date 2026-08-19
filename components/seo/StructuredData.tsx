// components/seo/StructuredData.tsx
import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/supabase/site-config';
import type { SiteContent } from '@/types/database';

export default async function StructuredData() {
  const supabase = await createClient();
  const { data: content } = await supabase.from('site_content').select('*');

  const map = ((content as SiteContent[]) ?? []).reduce<Record<string, string>>(
    (acc, row) => {
      acc[row.key] = row.value;
      return acc;
    },
    {}
  );

  // Only include fields that actually have real values — never fabricate.
  const sameAs = [map.contact_instagram].filter(Boolean);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'PhotographyBusiness',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    foundingDate: String(siteConfig.foundedYear),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    areaServed: {
      '@type': 'Country',
      name: siteConfig.location.countryName,
    },
    ...(map.contact_phone ? { telephone: map.contact_phone } : {}),
    ...(map.contact_email ? { email: map.contact_email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    priceRange: '$$$',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'en-IN',
  };

  return (
    <>
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}