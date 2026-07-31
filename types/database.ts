export interface GalleryImage {
  id: string;
  image_url: string;
  storage_path: string;
  alt_text: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string;
  message: string | null;
  status: 'new' | 'contacted' | 'booked' | 'closed';
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  quote: string;
  rating: number;
  sort_order: number;
  created_at: string;
}