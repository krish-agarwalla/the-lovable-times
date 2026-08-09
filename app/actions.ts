'use server';

import { createClient } from '@/lib/supabase/server';
import { isRateLimited } from '@/lib/supabase/rate-limit';
import { headers } from 'next/headers';
import {
  EVENT_TYPE_OPTIONS,
  PACKAGE_OPTIONS,
} from '@/lib/supabase/constants';

export async function submitInquiry(formData: {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  budget: string;
  package: string;
  message: string;
  website: string;
}) {
  // ============================================================
  // 1. HONEYPOT CHECK
  // ============================================================
  //
  // Real users never see or fill the "website" field.
  // If a bot fills it, silently pretend the submission succeeded.
  //

  if (formData.website) {
    return {
      success: true,
    };
  }

  // ============================================================
  // 2. BASIC SERVER-SIDE VALIDATION
  // ============================================================

  if (
    !formData.name?.trim() ||
    !formData.email?.trim()
  ) {
    return {
      error: 'Name and email are required.',
    };
  }

  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email.trim())) {
    return {
      error: 'Please enter a valid email address.',
    };
  }

  // ============================================================
  // EVENT TYPE + PACKAGE VALIDATION
  // ============================================================

  const validEventType =
    EVENT_TYPE_OPTIONS.includes(
      formData.event_type as (typeof EVENT_TYPE_OPTIONS)[number]
    );

  const validPackage =
    PACKAGE_OPTIONS.some(
      (pkg) => pkg.value === formData.package
    );

  if (!validEventType || !validPackage) {
    return {
      error: 'Invalid form submission.',
    };
  }

  // ============================================================
  // 3. RATE LIMITING BY IP
  // ============================================================

  const headersList = await headers();

  const ip =
    headersList
      .get('x-forwarded-for')
      ?.split(',')[0]
      .trim() ||
    headersList.get('x-real-ip') ||
    'unknown';

  const limited = await isRateLimited(ip);

  if (limited) {
    return {
      error:
        'Too many submissions. Please try again later or contact us via WhatsApp.',
    };
  }

  // ============================================================
  // 4. SUPABASE INSERT
  // ============================================================

  const supabase = await createClient();

  const { error } = await supabase
    .from('inquiries')
    .insert({
      name: formData.name
        .trim()
        .slice(0, 200),

      email: formData.email
        .trim()
        .slice(0, 200),

      phone:
        formData.phone
          ?.trim()
          .slice(0, 30) || null,

      event_type:
        formData.event_type,

      budget:
        formData.budget
          ?.trim()
          .slice(0, 100) || null,

      package:
        formData.package,

      message:
        formData.message
          ?.trim()
          .slice(0, 2000) || null,

      submitter_ip: ip,
    });

  // ============================================================
  // DATABASE ERROR
  // ============================================================

  if (error) {
    console.error(
      'Submit inquiry error:',
      error
    );

    return {
      error:
        'Something went wrong. Please try WhatsApp instead.',
    };
  }

  // ============================================================
  // SUCCESS
  // ============================================================

  return {
    success: true,
  };
}