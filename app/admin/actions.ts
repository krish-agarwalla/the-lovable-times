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
    // Remove uploaded file if database insert fails
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
// IMAGE DELETE
// ============================================================

export async function deleteImage(
  id: string,
  storagePath: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  // Delete from Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove([storagePath]);

  if (storageError) {
    return { error: storageError.message };
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true };
}

// ============================================================
// UPDATE SITE CONTENT
// ============================================================

export async function updateContent(
  key: string,
  value: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  const { error } = await supabase
    .from('site_content')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true };
}

// ============================================================
// LOGOUT
// ============================================================

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

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
    console.error(
      'Update inquiry status error:',
      error
    );

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

export async function deleteInquiry(
  inquiryId: string
) {
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
    console.error(
      'Delete inquiry error:',
      error
    );

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
// ADD TESTIMONIAL
// ============================================================

export async function addTestimonial(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  const clientName = (
    formData.get('client_name') as string
  )?.trim();

  const quote = (
    formData.get('quote') as string
  )?.trim();

  const ratingValue = Number(formData.get('rating'));

  // ----------------------------
  // Validate input
  // ----------------------------

  if (!clientName) {
    return { error: 'Client name is required.' };
  }

  if (!quote) {
    return { error: 'Testimonial quote is required.' };
  }

  if (
    !Number.isInteger(ratingValue) ||
    ratingValue < 1 ||
    ratingValue > 5
  ) {
    return { error: 'Rating must be between 1 and 5.' };
  }

  // ----------------------------
  // Determine next sort order
  // ----------------------------

  const { data: lastTestimonial, error: sortError } =
    await supabase
      .from('testimonials')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

  if (sortError) {
    console.error(
      'Get testimonial sort order error:',
      sortError
    );

    return { error: sortError.message };
  }

  const nextSortOrder =
    (lastTestimonial?.sort_order ?? 0) + 1;

  // ----------------------------
  // Insert testimonial
  // ----------------------------

  const { error } = await supabase
    .from('testimonials')
    .insert({
      client_name: clientName,
      quote,
      rating: ratingValue,
      sort_order: nextSortOrder,
    });

  if (error) {
    console.error(
      'Add testimonial error:',
      error
    );

    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');

  return {
    success: true,
  };
}
// ============================================================
// DELETE TESTIMONIAL
// ============================================================

export async function deleteTestimonial(
  testimonialId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized.' };
  }

  if (!testimonialId) {
    return { error: 'Invalid testimonial ID.' };
  }

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', testimonialId);

  if (error) {
    console.error(
      'Delete testimonial error:',
      error
    );

    return {
      error: error.message,
    };
  }

  revalidatePath('/');
  revalidatePath('/admin');

  return {
    success: true,
  };
}