'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
    <nav
      className="
        fixed
        top-0
        left-0
        right-0
        z-100
        w-full
        border-b
        border-white/10
        bg-charcoal
      "
    >
      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-6
          sm:px-8
        "
      >
        {/* ===================================================
            BRAND
        ==================================================== */}

        <Link
          href="/#home"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          {/* Logo */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white">
            <Image
              src="/images/logo.png"
              alt="The Lovable Times"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>

          {/* Brand name */}
          <span className="text-sm font-medium tracking-wide text-white sm:text-base">
            The Lovable Times
            <span className="text-white/70">
              {' '}
              | Photos & Films
            </span>
          </span>
        </Link>

        {/* ===================================================
            DESKTOP NAVIGATION
        ==================================================== */}

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

        {/* ===================================================
            MOBILE MENU BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-white
            transition-colors
            duration-300
            hover:bg-white/10
            hover:text-neon-pink
            md:hidden
          "
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU

          IMPORTANT:
          The menu itself does NOT animate opacity.

          This prevents the page underneath from showing
          through the navigation while it opens/closes.
      ====================================================== */}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              overflow-hidden
              border-t
              border-white/10
              bg-charcoal
              md:hidden
            "
          >
            <div className="flex flex-col px-6 py-4">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="
                    border-b
                    border-white/5
                    py-4
                    text-sm
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-white/80
                    transition-colors
                    duration-300
                    last:border-b-0
                    hover:text-neon-pink
                  "
                >
                  <motion.span
                    initial={{
                      opacity: 0,
                      x: -8,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.04,
                    }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}