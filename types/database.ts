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