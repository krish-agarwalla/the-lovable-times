'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { GALLERY_CATEGORIES } from '@/lib/supabase/constants';

// ============================================================
// IMAGE UPLOAD
// ============================================================

export async function uploadImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  const file = formData.get('file') as File | null;
  const category = formData.get('category') as string | null;
  const altText =
    (formData.get('altText') as string) || 'The Lovable Times';

  if (!file || file.size === 0) {
    return { error: 'No file provided.' };
  }

  if (
    !category ||
    !GALLERY_CATEGORIES.includes(
      category as (typeof GALLERY_CATEGORIES)[number]
    )
  ) {
    return { error: 'Please select a valid category.' };
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (!fileExt) {
    return { error: 'Invalid file type.' };
  }

  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const storagePath = `public/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(storagePath, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('gallery')
    .getPublicUrl(storagePath);

  const { error: dbError } = await supabase
    .from('gallery_images')
    .insert({
      image_url: publicUrl,
      storage_path: storagePath,
      alt_text: altText,
      category,
    });

  if (dbError) {
    // Clean up uploaded image if database insert fails
    await supabase.storage
      .from('gallery')
      .remove([storagePath]);

    return { error: dbError.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true };
}

// ============================================================
// UPDATE INQUIRY STATUS
// ============================================================

export async function updateInquiryStatus(
  inquiryId: string,
  status: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  const allowedStatuses = [
    'new',
    'contacted',
    'booked',
    'closed',
  ];

  if (!allowedStatuses.includes(status)) {
    return { error: 'Invalid inquiry status.' };
  }

  const { error } = await supabase
    .from('inquiries')
    .update({
      status,
    })
    .eq('id', inquiryId);

  if (error) {
    console.error('Update inquiry status error:', error);

    return {
      error: error.message,
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
  };
}

// ============================================================
// DELETE INQUIRY
// ============================================================

export async function deleteInquiry(inquiryId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', inquiryId);

  if (error) {
    console.error('Delete inquiry error:', error);

    return {
      error: error.message,
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
  };
}