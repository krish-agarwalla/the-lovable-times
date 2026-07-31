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

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neon-pink/20 bg-charcoal/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <Link href="/" className="group flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="The Lovable Times"
          width={52}
          height={52}
          priority
          className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
        />
        <span className="font-street text-lg tracking-wider text-white">
          The Lovable <span className="text-neon-pink">Times</span>
        </span>
      </Link>

        {/* Desktop Links */}
        <div className="hidden gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-neon-pink after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-neon-pink after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-neon-pink/20 bg-charcoal md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-neon-pink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}