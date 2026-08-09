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
      {/* ================= VIDEO BACKGROUND ================= */}

      {/* Desktop / Laptop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Mobile */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 block h-full w-full object-cover md:hidden"
      >
        <source src="/videos/hero-mobile.mp4" type="video/mp4" />
      </video>

      {/* Optional overlay for better text readability.
          Remove if your video is already dark enough. */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-neon-pink/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-hot-pink/10 blur-[120px]" />

      {/* ================= CONTENT ================= */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-4 flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] text-pastel-pink"
      >
      <p className="mt-4 text-sm text-white/40">
        Serving Pan India
      </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-10 font-street text-5xl leading-[1.05] tracking-wide text-white sm:text-7xl md:text-8xl"
      >
        {tagline || 'FRAMES THAT HIT DIFFERENT.'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 mt-6 max-w-xl text-lg text-white/70"
      >
        {subtext || 'Street-raw. Soul-deep. Photography by Sangram AJ.'}
      </motion.p>

      <motion.a
        href="#gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mt-10 rounded-full border-2 border-neon-pink px-8 py-3 font-semibold uppercase tracking-widest text-neon-pink transition-all hover:bg-neon-pink hover:text-charcoal hover:shadow-neon-glow"
      >
        View Work
      </motion.a>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-10 z-10"
      >
        <ArrowDown className="h-6 w-6 text-neon-pink" />
      </motion.div>
    </section>
  );
}