import Image from 'next/image';

export default function About({ aboutText }: { aboutText: string }) {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-neon-pink/30 shadow-neon-glow">
          {/* Replace with an actual portrait of Sangram AJ via admin upload or static asset */}
          <Image
            src="/sangram-portrait.jpg"
            alt="Sangram AJ - Founder of The Lovable Times"
            fill
            className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
          />
        </div>

        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-neon-pink">
            The Story
          </p>
          <h2 className="mb-6 font-street text-4xl text-white sm:text-5xl">
            SANGRAM <span className="text-hot-pink">AJ</span>
          </h2>
          <p className="leading-relaxed text-white/70">
            {aboutText}
          </p>
          <p className="mt-4 text-sm text-white/40">
            📍 Rairangpur, Mayurbhanj, Odisha
          </p>
        </div>
      </div>
    </section>
  );
}