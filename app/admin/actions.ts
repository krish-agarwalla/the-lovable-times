'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ---------- IMAGE UPLOAD ----------
export async function uploadImage(formData: FormData) {
  const supabase = await createClient();

  // Re-check auth server-side — critical, don't rely on UI state
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authorized.' };

  const file = formData.get('file') as File;
  const category = (formData.get('category') as string) || 'general';
  const altText = (formData.get('altText') as string) || 'The Lovable Times';

  if (!file || file.size === 0) return { error: 'No file provided.' };

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const storagePath = `public/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(storagePath, file);

  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from('gallery').getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from('gallery_images').insert({
    image_url: publicUrl,
    storage_path: storagePath,
    alt_text: altText,
    category,
  });

  if (dbError) return { error: dbError.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// ---------- IMAGE DELETE ----------
export async function deleteImage(id: string, storagePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authorized.' };

  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove([storagePath]);
  if (storageError) return { error: storageError.message };

  const { error: dbError } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);
  if (dbError) return { error: dbError.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// ---------- CONTENT UPDATE ----------
export async function updateContent(key: string, value: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authorized.' };

  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// ---------- LOGOUT ----------
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/admin');
}