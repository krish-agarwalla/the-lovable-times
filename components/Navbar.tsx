'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* ======================================================
          NAVBAR
      ======================================================= */}

      <nav className="fixed left-0 right-0 top-0 z-100 w-full bg-charcoal">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between border-b border-white/10 px-6 sm:px-8">

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            href="/#home"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-white">
              <Image
                src="/public/logo.png"
                alt="The Lovable Times"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>

            <span className="text-sm font-medium tracking-wide text-white sm:text-base">
              The Lovable Times
              <span className="text-white/60">
                {' '}
                | Photos & Films
              </span>
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
                className="
                  relative
                  text-sm
                  font-medium
                  uppercase
                  tracking-widest
                  text-white/80
                  transition-colors
                  duration-300
                  hover:text-neon-pink

                  after:absolute
                  after:-bottom-1
                  after:left-0
                  after:h-0.5
                  after:w-0
                  after:bg-neon-pink
                  after:transition-all
                  after:duration-300

                  hover:after:w-full
                "
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
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              text-white
              transition-all
              duration-300
              hover:border-neon-pink
              hover:text-neon-pink
              md:hidden
            "
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
            {/* ==================================================
                BACKDROP
            ================================================== */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="
                fixed
                inset-0
                z-110
                bg-black/60
                md:hidden
              "
            />

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                right-0
                top-0
                z-120
                flex
                h-dvh
                w-[85%]
                max-w-sm
                flex-col
                bg-charcoal
                shadow-2xl
                md:hidden
              "
            >
              {/* ==================================================
                  SIDEBAR HEADER
              ================================================== */}

              <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden bg-white">
                    <Image
                      src="/images/logo.png"
                      alt="The Lovable Times"
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
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

                {/* Close */}
                <button
                  type="button"
                  onClick={closeMenu}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    text-white/70
                    transition-all
                    duration-300
                    hover:border-neon-pink
                    hover:text-neon-pink
                  "
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ==================================================
                  SIDEBAR CONTENT
              ================================================== */}

              <div className="flex flex-1 flex-col px-6 py-10">
                <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.3em] text-neon-pink">
                  Explore
                </p>

                <div className="flex flex-col">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{
                        opacity: 0,
                        x: 25,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          0.08 +
                          index * 0.06,
                        duration: 0.35,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/10
                          py-5
                        "
                      >
                        <span className="
                          font-street
                          text-3xl
                          uppercase
                          tracking-wide
                          text-white/80
                          transition-colors
                          duration-300
                          group-hover:text-neon-pink
                        ">
                          {link.label}
                        </span>

                        <ArrowUpRight
                          className="
                            h-5
                            w-5
                            text-white/30
                            transition-all
                            duration-300
                            group-hover:-translate-y-1
                            group-hover:translate-x-1
                            group-hover:text-neon-pink
                          "
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* ==================================================
                    BOTTOM INFORMATION
                ================================================== */}

                <div className="mt-auto border-t border-white/10 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                    Wedding Photography & Films
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    Serving Pan India
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}