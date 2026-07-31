import { createClient } from '@/lib/supabase/server';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { GalleryImage, SiteContent, Testimonial } from '@/types/database';

function contentMap(rows: SiteContent[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: images }, { data: content }, { data: testimonials }] =
    await Promise.all([
      supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase.from('site_content').select('*'),
      supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true }),
    ]);

  const c = contentMap((content as SiteContent[]) ?? []);

  return (
    <>
      <Hero tagline={c.hero_tagline} subtext={c.hero_subtext} />
      <Gallery images={(images as GalleryImage[]) ?? []} />
      <About aboutText={c.about_text} />
      <Testimonials items={(testimonials as Testimonial[]) ?? []} />
      <Contact
        email={c.contact_email}
        phone={c.contact_phone}
        instagram={c.contact_instagram}
      />
      <WhatsAppButton number={c.whatsapp_number ?? '919000000000'} />
    </>
  );
}