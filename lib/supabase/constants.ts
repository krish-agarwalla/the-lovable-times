// lib/constants.ts

// ============================================
// GALLERY CATEGORIES
// Used in: Admin upload dropdown + public gallery filter pills
// ============================================
export const GALLERY_CATEGORIES = [
  'Pre-Wedding',
  'Engagement',
  'Haldi',
  'Mehndi & Sangeet',
  'Wedding',
  'Reception',
  'Candid Photos & Cinematic Film',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

// ============================================
// CONTACT FORM — EVENT TYPE OPTIONS
// ============================================
export const EVENT_TYPE_OPTIONS = [
  'Pre-Wedding',
  'Engagement',
  'Single Side Wedding',
  'Both Side Wedding',
  'Other',
] as const;

// ============================================
// CONTACT FORM — PACKAGE OPTIONS
// value = what gets stored in DB, label = what customer sees
// ============================================
export const PACKAGE_OPTIONS = [
  {
    value: 'semi_cinematic_1day',
    label: '₹38,500 — Semi-Cinematic | 1 Day Event',
  },
  {
    value: 'full_cinematic_1day',
    label: '₹78,000 — Full-Cinematic | 1 Day Event',
  },
  {
    value: 'full_cinematic_1day_preweding',
    label: '₹78,000 — Full-Cinematic | 1 Day Event + Pre-Wedding',
  },
  {
    value: 'semi_cinematic_wedding',
    label: '₹1,40,000 — Semi-Cinematic Wedding',
  },
  {
    value: 'full_cinematic_wedding',
    label: '₹2,60,000 — Full-Cinematic Wedding',
  },
  {
    value: 'luxury_wedding',
    label: '₹3,80,000 — Luxury Wedding',
  },
  {
    value: 'not_sure',
    label: 'Not Sure, need idea',
  },
] as const;