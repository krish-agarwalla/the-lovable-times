import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import ImageManager from '@/components/admin/ImageManager';
import ContentEditor from '@/components/admin/ContentEditor';
import LogoutButton from '@/components/admin/LogoutButton';
import type { GalleryImage, SiteContent } from '@/types/database';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Defense in depth: middleware already blocks unauthenticated
  // access, but we double-check here too since this is sensitive.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const [{ data: images }, { data: content }] = await Promise.all([
    supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase.from('site_content').select('*'),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-street text-3xl text-white">
            ADMIN <span className="text-neon-pink">DASHBOARD</span>
          </h1>
          <p className="text-sm text-white/50">Logged in as {user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <ImageUploader />
          <ContentEditor content={(content as SiteContent[]) ?? []} />
        </div>
        <ImageManager images={(images as GalleryImage[]) ?? []} />
      </div>
    </div>
  );
}