import { createClient } from '@/lib/supabase/server';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Contact from '@/components/Contact';
import type { GalleryImage, SiteContent } from '@/types/database';

// Helper to turn the key-value rows into an easy lookup object
function contentMap(rows: SiteContent[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: images }, { data: content }] = await Promise.all([
    supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.from('site_content').select('*'),
  ]);

  const c = contentMap((content as SiteContent[]) ?? []);

  return (
    <>
      <Hero tagline={c.hero_tagline} subtext={c.hero_subtext} />
      <Gallery images={(images as GalleryImage[]) ?? []} />
      <About aboutText={c.about_text} />
      <Contact
        email={c.contact_email}
        phone={c.contact_phone}
        instagram={c.contact_instagram}
      />
    </>
  );
}