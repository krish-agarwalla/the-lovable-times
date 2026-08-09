'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/lib/supabase/constants';
import type { GalleryImage } from '@/types/database';

export default function Gallery({
  images,
}: {
  images: GalleryImage[];
}) {
  // ============================================================
  // STATE
  // ============================================================

  const [selected, setSelected] =
    useState<GalleryImage | null>(null);

  const [activeCategory, setActiveCategory] =
    useState('all');

  const [activeIndex, setActiveIndex] =
    useState(0);

  // ============================================================
  // REFS
  // ============================================================

  const carouselRef =
    useRef<HTMLDivElement>(null);

  const activeIndexRef =
    useRef(0);

  const autoScrollRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep the ref synchronized with the state.
  // This lets the auto-scroll interval always know
  // which image is currently in the center.
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // ============================================================
  // CATEGORY LIST
  // ============================================================

  const categories = [
    'all',
    ...GALLERY_CATEGORIES,
  ];

  // ============================================================
  // FILTER IMAGES
  // ============================================================

  const filtered = useMemo(() => {
    if (activeCategory === 'all') {
      return images;
    }

    return images.filter(
      (img) => img.category === activeCategory
    );
  }, [images, activeCategory]);

  // ============================================================
  // OPEN / CLOSE IMAGE
  // ============================================================

  const openImage = (image: GalleryImage) => {
    setSelected(image);
  };

  const closeImage = () => {
    setSelected(null);
  };

  // ============================================================
  // FIND WHICH IMAGE IS IN THE CENTER
  // ============================================================

  const updateActiveIndex = () => {
    const container = carouselRef.current;

    if (!container) return;

    const cards =
      container.querySelectorAll<HTMLElement>(
        '[data-gallery-card]'
      );

    if (!cards.length) return;

    const containerRect =
      container.getBoundingClientRect();

    const containerCenter =
      containerRect.left +
      containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect =
        card.getBoundingClientRect();

      const cardCenter =
        rect.left +
        rect.width / 2;

      const distance = Math.abs(
        containerCenter - cardCenter
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (
      activeIndexRef.current !== closestIndex
    ) {
      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    }
  };

  // ============================================================
  // SCROLL LISTENER
  // ============================================================

  useEffect(() => {
    const container =
      carouselRef.current;

    if (!container) return;

    const handleScroll = () => {
      updateActiveIndex();
    };

    const handleResize = () => {
      updateActiveIndex();
    };

    container.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      container.removeEventListener(
        'scroll',
        handleScroll
      );

      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, [filtered]);

  // ============================================================
  // SCROLL TO A PARTICULAR IMAGE
  // ============================================================

  const scrollToIndex = (
    index: number,
    smooth = true
  ) => {
    const container =
      carouselRef.current;

    if (!container) return;

    const cards =
      container.querySelectorAll<HTMLElement>(
        '[data-gallery-card]'
      );

    const card = cards[index];

    if (!card) return;

    const containerRect =
      container.getBoundingClientRect();

    const cardRect =
      card.getBoundingClientRect();

    const containerCenter =
      containerRect.left +
      containerRect.width / 2;

    const cardCenter =
      cardRect.left +
      cardRect.width / 2;

    const scrollDifference =
      cardCenter - containerCenter;

    container.scrollTo({
      left:
        container.scrollLeft +
        scrollDifference,
      behavior: smooth
        ? 'smooth'
        : 'auto',
    });
  };

  // ============================================================
  // CATEGORY CHANGE
  // ============================================================

  const handleCategoryChange = (
    category: string
  ) => {
    setActiveCategory(category);

    activeIndexRef.current = 0;
    setActiveIndex(0);

    // Wait for React to render the new category
    // before trying to scroll the new carousel.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!carouselRef.current) return;

        carouselRef.current.scrollTo({
          left: 0,
          behavior: 'auto',
        });
      });
    });
  };

  // ============================================================
  // AUTO CAROUSEL
  // ============================================================

  useEffect(() => {
    if (filtered.length <= 1) {
      return;
    }

    autoScrollRef.current =
      setInterval(() => {
        const currentIndex =
          activeIndexRef.current;

        const nextIndex =
          currentIndex + 1 >= filtered.length
            ? 0
            : currentIndex + 1;

        activeIndexRef.current =
          nextIndex;

        scrollToIndex(
          nextIndex,
          true
        );
      }, 4000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(
          autoScrollRef.current
        );

        autoScrollRef.current = null;
      }
    };
  }, [filtered.length]);

  // ============================================================
  // MANUAL NAVIGATION
  // ============================================================

  const scrollToImage = (
    direction: 'left' | 'right'
  ) => {
    if (!filtered.length) return;

    const currentIndex =
      activeIndexRef.current;

    let targetIndex: number;

    if (direction === 'right') {
      targetIndex =
        currentIndex + 1 >= filtered.length
          ? 0
          : currentIndex + 1;
    } else {
      targetIndex =
        currentIndex - 1 < 0
          ? filtered.length - 1
          : currentIndex - 1;
    }

    activeIndexRef.current =
      targetIndex;

    setActiveIndex(targetIndex);

    scrollToIndex(
      targetIndex,
      true
    );
  };

  // ============================================================
  // NO IMAGES
  // ============================================================

  if (!images.length) {
    return (
      <section
        id="gallery"
        className="bg-charcoal py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-center font-street text-4xl tracking-wide text-white sm:text-5xl">
            THE GALLERY
          </h2>

          <p className="text-center text-white/40">
            No photos uploaded yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // MAIN GALLERY
  // ============================================================

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-charcoal py-20 sm:py-24 lg:py-28"
    >
      {/* ========================================================
          TITLE
      ========================================================= */}

      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="mb-8 text-center font-street text-4xl tracking-wide text-white sm:text-5xl lg:text-6xl"
      >
        THE GALLERY
      </motion.h2>

      {/* ========================================================
          CATEGORY FILTERS
      ========================================================= */}

      <div className="mx-auto mb-12 flex max-w-7xl flex-wrap justify-center gap-3 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() =>
              handleCategoryChange(cat)
            }
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

      {/* ========================================================
          CATEGORY CONTENT
      ========================================================= */}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="relative"
        >
          {/* ====================================================
              EMPTY CATEGORY
          ==================================================== */}

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-white/40">
              No photos in this category yet.
            </p>
          ) : (
            <>
              {/* ==================================================
                  LEFT ARROW
              =================================================== */}

              <button
                type="button"
                onClick={() =>
                  scrollToImage('left')
                }
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:border-neon-pink hover:text-neon-pink lg:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* ==================================================
                  RIGHT ARROW
              =================================================== */}

              <button
                type="button"
                onClick={() =>
                  scrollToImage('right')
                }
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:border-neon-pink hover:text-neon-pink lg:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* ==================================================
                  HORIZONTAL CAROUSEL
              =================================================== */}

              <div
                ref={carouselRef}
                className="gallery-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50vw-120px)] pb-10 sm:gap-6 sm:px-[calc(50vw-150px)] lg:gap-8 lg:px-[calc(50vw-180px)]"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {filtered.map(
                  (img, index) => {
                    /*
                     * Distance from the center image.
                     *
                     * Center:
                     * 1.12
                     *
                     * One away:
                     * 0.92
                     *
                     * Two or more away:
                     * 0.82
                     */
                    const distance =
                      Math.abs(
                        index -
                          activeIndex
                      );

                    const scale =
                      distance === 0
                        ? 1.12
                        : distance === 1
                          ? 0.92
                          : 0.82;

                    return (
                      <motion.div
                        key={img.id}
                        data-gallery-card
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale,
                        }}
                        transition={{
                          duration: 0.45,
                          ease: 'easeOut',
                        }}
                        onClick={() =>
                          openImage(img)
                        }
                        onMouseEnter={() => {
                          /*
                           * Desktop:
                           * Hover opens fullscreen.
                           *
                           * Mobile:
                           * This will not trigger because
                           * touch devices generally don't
                           * have hover capability.
                           */
                          if (
                            window.matchMedia(
                              '(hover: hover)'
                            ).matches
                          ) {
                            openImage(img);
                          }
                        }}
                        className="group relative w-60 shrink-0 cursor-pointer snap-center overflow-hidden rounded-xl border border-white/10 bg-black/20 sm:w-75 lg:w-90"
                      >
                        {/* =================================================
                            IMAGE
                        ================================================== */}

                        <div className="relative aspect-3/4 overflow-hidden">
                          <Image
                            src={
                              img.image_url
                            }
                            alt={
                              img.alt_text
                            }
                            fill
                            sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 360px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* =================================================
                              HOVER OVERLAY
                          ================================================== */}

                          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                          {/* =================================================
                              CATEGORY LABEL
                          ================================================== */}

                          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-12 transition-transform duration-500 group-hover:translate-y-0">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                              {
                                img.category
                              }
                            </span>
                          </div>

                          {/* =================================================
                              CENTER INDICATOR
                          ================================================== */}

                          {index ===
                            activeIndex && (
                            <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-neon-pink px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal shadow-neon-glow">
                              Featured
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>

              {/* ==================================================
                  MOBILE SWIPE INDICATOR
              =================================================== */}

              <div className="mt-2 flex justify-center text-xs uppercase tracking-[0.25em] text-white/30 lg:hidden">
                Swipe to explore
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ========================================================
          FULLSCREEN IMAGE VIEWER
      ========================================================= */}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={closeImage}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-6"
          >
            {/* ==================================================
                CLOSE BUTTON
            =================================================== */}

            <button
              type="button"
              aria-label="Close image"
              onClick={(e) => {
                e.stopPropagation();
                closeImage();
              }}
              className="absolute right-5 top-5 z-20 rounded-full border border-white/20 bg-black/50 p-2 text-white transition hover:border-neon-pink hover:text-neon-pink sm:right-8 sm:top-8"
            >
              <X className="h-7 w-7" />
            </button>

            {/* ==================================================
                FULLSCREEN IMAGE
            =================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="relative max-h-[90vh] max-w-[95vw]"
            >
              <Image
                src={
                  selected.image_url
                }
                alt={
                  selected.alt_text
                }
                width={1600}
                height={2000}
                className="max-h-[90vh] w-auto rounded-lg object-contain shadow-neon-glow"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}