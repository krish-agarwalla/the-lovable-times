import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import LogoutButton from '@/components/admin/LogoutButton';
import type { GalleryImage, SiteContent, Inquiry, Testimonial } from '@/types/database';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const [{ data: images }, { data: content }, { data: inquiries }, { data: testimonials }] =
    await Promise.all([
      supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
      supabase.from('site_content').select('*'),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
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

      <AdminDashboardClient
        images={(images as GalleryImage[]) ?? []}
        content={(content as SiteContent[]) ?? []}
        inquiries={(inquiries as Inquiry[]) ?? []}
        testimonials={(testimonials as Testimonial[]) ?? []}
      />
    </div>
  );
}