'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types/database';

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;

  return (
    <section id="testimonials" className="px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center font-street text-4xl text-white sm:text-5xl"
      >
        CLIENT <span className="text-neon-pink">LOVE</span>
      </motion.h2>

      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/10 bg-grit p-6 transition-colors hover:border-neon-pink/40"
          >
            <Quote className="mb-3 h-6 w-6 text-neon-pink/50" />
            <p className="mb-4 text-white/80">
                  &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {t.client_name}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-neon-pink text-neon-pink"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}