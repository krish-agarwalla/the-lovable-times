'use client';

import Masonry from 'react-masonry-css';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/lib/supabase/constants';
import type { GalleryImage } from '@/types/database';

const breakpointCols = { default: 3, 1024: 3, 768: 2, 500: 1 };

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Fixed list, always in this exact order — not derived from the data
  const categories = ['all', ...GALLERY_CATEGORIES];

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? images
        : images.filter((img) => img.category === activeCategory),
    [images, activeCategory]
  );

  if (!images.length) {
    return (
      <section id="gallery" className="px-6 py-24 text-center">
        <h2 className="font-street text-4xl text-white">GALLERY</h2>
        <p className="mt-4 text-white/50">
          No photos uploaded yet. Check back soon.
        </p>
      </section>
    );
  }

  return (
    <section id="gallery" className="px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 text-center font-street text-4xl tracking-wide text-white sm:text-5xl"
      >
        THE <span className="text-neon-pink">GALLERY</span>
      </motion.h2>

      {/* Category filter pills — wraps nicely on mobile since there are 8 total */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-5 py-2 text-sm font-medium uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? 'border-neon-pink bg-neon-pink text-charcoal shadow-neon-glow'
                : 'border-white/20 text-white/60 hover:border-neon-pink/50 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-white/40">
              No photos in this category yet.
            </p>
          ) : (
            <Masonry
              breakpointCols={breakpointCols}
              className="masonry-grid mx-auto max-w-7xl"
              columnClassName="masonry-grid_column"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i % 6) * 0.05 }}
                  onClick={() => setSelected(img)}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/10"
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text}
                    width={600}
                    height={800}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-neon-pink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="p-4 text-sm font-semibold uppercase tracking-widest text-white">
                      {img.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          )}
        </motion.div>
      </AnimatePresence>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
        >
          <button
            className="absolute right-6 top-6 text-white hover:text-neon-pink"
            onClick={() => setSelected(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <Image
            src={selected.image_url}
            alt={selected.alt_text}
            width={1200}
            height={1600}
            className="max-h-[85vh] w-auto rounded-lg object-contain shadow-neon-glow"
          />
        </div>
      )}
    </section>
  );
}