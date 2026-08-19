// app/not-found.tsx
import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <Camera className="mb-6 h-12 w-12 text-neon-pink" />

      <h1 className="font-street text-5xl tracking-wide text-white sm:text-6xl">
        FRAME <span className="text-neon-pink">NOT FOUND</span>
      </h1>

      <p className="mt-4 max-w-md text-white/60">
        This page doesn&apos;t exist — but the story continues. Let&apos;s get you back
        to something worth seeing.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-neon-pink px-6 py-3 text-sm font-semibold uppercase tracking-widest text-charcoal transition hover:shadow-neon-glow"
        >
          Back to Home
        </Link>
        <Link
          href="/#gallery"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white/80 transition hover:border-neon-pink hover:text-neon-pink"
        >
          View Gallery
        </Link>
        <Link
          href="/#contact"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white/80 transition hover:border-neon-pink hover:text-neon-pink"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}