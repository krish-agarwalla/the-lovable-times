'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About', href: '/#about' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ];

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* ======================================================
          NAVBAR
      ======================================================= */}

      <nav
        className={`fixed left-0 right-0 top-0 z-100 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-charcoal/90 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl'
            : 'bg-charcoal/60 backdrop-blur-md'
        }`}
      >
        <div
          className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${
            scrolled
              ? 'bg-linear-to-r from-transparent via-neon-pink/50 to-transparent opacity-100'
              : 'bg-white/10 opacity-100'
          }`}
        />

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          {/* ==================================================
              LOGO — now a TRUE circular crop, image fills edge
              to edge with object-cover, no padding, no square
              artifact visible inside the ring.
          ================================================== */}

          <Link
            href="/#home"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 transition-all duration-300 group-hover:border-neon-pink/60 group-hover:shadow-neon-glow">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="The Lovable Times"
                  fill
                  sizes="44px"
                  className="object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-paper">
                  <Camera className="h-5 w-5 text-neon-pink" />
                </div>
              )}
            </div>

            <span className="text-sm font-medium tracking-wide text-white sm:text-base">
              The Lovable Times
              <span className="hidden text-white/50 sm:inline"> | Photos & Films</span>
            </span>
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium uppercase tracking-widest text-white/80 transition-colors duration-300 hover:text-neon-pink after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-neon-pink after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ==================================================
              MOBILE HAMBURGER
          ================================================== */}

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-glow active:scale-95 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* ======================================================
          MOBILE SIDEBAR
      ======================================================= */}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 z-110 bg-black/70 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-120 flex h-dvh w-[85%] max-w-sm flex-col overflow-hidden border-l border-neon-pink/20 bg-linear-to-b from-grit via-charcoal to-charcoal shadow-2xl md:hidden"
            >
              <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-neon-pink/15 blur-[100px]" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-hot-pink/10 blur-[100px]" />

              {/* ==================================================
                  SIDEBAR HEADER — same circular logo fix
              ================================================== */}

              <div className="relative flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10">
                    {!logoError ? (
                      <Image
                        src="/logo.png"
                        alt="The Lovable Times"
                        fill
                        sizes="40px"
                        className="object-cover"
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white">
                        <Camera className="h-4 w-4 text-neon-pink" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      The Lovable Times
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">
                      Photos & Films
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-neon-pink hover:text-neon-pink active:scale-95"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ==================================================
                  SIDEBAR CONTENT
              ================================================== */}

              <div className="relative flex flex-1 flex-col px-6 py-10">
                <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.3em] text-neon-pink">
                  Explore
                </p>

                <div className="flex flex-col">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 + index * 0.06,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="group flex items-center justify-between border-b border-white/10 py-5"
                      >
                        <span className="font-street text-3xl uppercase tracking-wide text-white/80 transition-colors duration-300 group-hover:text-neon-pink">
                          {link.label}
                        </span>
                        <ArrowUpRight className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neon-pink" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto border-t border-white/10 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                    Wedding Photography & Films
                  </p>
                  <p className="mt-2 text-sm text-white/50">Serving Pan India</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}