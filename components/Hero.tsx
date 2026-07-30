'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero({
  tagline,
  subtext,
}: {
  tagline: string;
  subtext: string;
}) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Glow blobs for depth */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-neon-pink/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-hot-pink/10 blur-[120px]" />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-sm uppercase tracking-[0.3em] text-pastel-pink"
      >
        Rairangpur · Mayurbhanj · Odisha
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-street text-5xl leading-[1.05] tracking-wide text-white sm:text-7xl md:text-8xl"
      >
        {tagline || 'FRAMES THAT HIT DIFFERENT.'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 max-w-xl text-lg text-white/70"
      >
        {subtext || 'Street-raw. Soul-deep. Photography by Sangram AJ.'}
      </motion.p>

      <motion.a
        href="#gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-10 rounded-full border-2 border-neon-pink px-8 py-3 font-semibold uppercase tracking-widest text-neon-pink transition-all hover:bg-neon-pink hover:text-charcoal hover:shadow-neon-glow"
      >
        View Work
      </motion.a>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-10"
      >
        <ArrowDown className="h-6 w-6 text-neon-pink" />
      </motion.div>
    </section>
  );
}