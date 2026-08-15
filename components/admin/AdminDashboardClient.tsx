'use client';

import { useState } from 'react';
import { Image as ImageIcon, Star, Inbox, Home } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import ImageManager from '@/components/admin/ImageManager';
import ContentEditor from '@/components/admin/ContentEditor';
import InquiriesManager from '@/components/admin/InquiriesManager';
import InquiryExport from '@/components/admin/InquiryExport';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import type { GalleryImage, SiteContent, Inquiry, Testimonial } from '@/types/database';

type TabKey = 'gallery' | 'testimonials' | 'inquiries' | 'homepage';

const TABS: { key: TabKey; label: string; icon: typeof ImageIcon }[] = [
  { key: 'gallery', label: 'Manage Gallery', icon: ImageIcon },
  { key: 'testimonials', label: 'Manage Testimonials', icon: Star },
  { key: 'inquiries', label: 'Check Inquiries', icon: Inbox },
  { key: 'homepage', label: 'Manage Home Page', icon: Home },
];

export default function AdminDashboardClient({
  images,
  content,
  inquiries,
  testimonials,
}: {
  images: GalleryImage[];
  content: SiteContent[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('gallery');

  // Small badge count next to "Check Inquiries" for leads that
  // still need attention — quick at-a-glance signal without
  // having to open the tab.
  const newInquiryCount = inquiries.filter((inq) => inq.status === 'new').length;

  return (
    <div>
      {/* ============================================
          TAB NAVIGATION
          Horizontally scrollable on small screens so
          it never wraps awkwardly or gets cut off.
      ============================================= */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-neon-pink/20 bg-grit p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-pink text-charcoal shadow-neon-glow'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}

                {tab.key === 'inquiries' && newInquiryCount > 0 && (
                  <span
                    className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                      isActive ? 'bg-charcoal text-neon-pink' : 'bg-neon-pink text-charcoal'
                    }`}
                  >
                    {newInquiryCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================
          ACTIVE PANEL
          Only the selected section's components mount
          — everything else stays out of the DOM, so the
          dashboard never feels cluttered or slow.
      ============================================= */}
      {activeTab === 'gallery' && (
        <div className="grid gap-8 lg:grid-cols-2">
          <ImageUploader />
          <ImageManager images={images} />
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="max-w-2xl">
          <TestimonialsManager items={testimonials} />
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="grid gap-8 lg:grid-cols-2">
          <InquiryExport inquiries={inquiries} />
          <InquiriesManager inquiries={inquiries} />
        </div>
      )}

      {activeTab === 'homepage' && (
        <div className="max-w-2xl">
          <ContentEditor content={content} />
        </div>
      )}
    </div>
  );
}