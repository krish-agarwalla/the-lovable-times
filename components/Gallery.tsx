'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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

  const isPausedRef =
    useRef(false);

  // Keep ref synchronized with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // ============================================================
  // CATEGORIES
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
  // INFINITE CAROUSEL DATA
  //
  // Three copies:
  //
  // A B C D | A B C D | A B C D
  //             ^
  //         start here
  //
  // This lets the carousel continuously move forward.
  // ============================================================

  const carouselImages = useMemo(() => {
    if (!filtered.length) {
      return [];
    }

    return [
      ...filtered,
      ...filtered,
      ...filtered,
    ];
  }, [filtered]);

  // ============================================================
  // IMAGE VIEWER
  // ============================================================

  const openImage = (image: GalleryImage) => {
    setSelected(image);
  };

  const closeImage = () => {
    setSelected(null);
  };

  // ============================================================
  // FIND IMAGE CLOSEST TO CENTER
  // ============================================================

  const findCenterIndex = () => {
    const container = carouselRef.current;

    if (!container) {
      return 0;
    }

    const cards =
      container.querySelectorAll<HTMLElement>(
        '[data-gallery-card]'
      );

    if (!cards.length) {
      return 0;
    }

    const containerRect =
      container.getBoundingClientRect();

    const containerCenter =
      containerRect.left +
      containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();

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

    return closestIndex;
  };

  // ============================================================
  // SCROLL TO SPECIFIC CARD
  // ============================================================

  const scrollToIndex = (
    index: number,
    smooth = true
  ) => {
    const container = carouselRef.current;

    if (!container) {
      return;
    }

    const cards =
      container.querySelectorAll<HTMLElement>(
        '[data-gallery-card]'
      );

    const card = cards[index];

    if (!card) {
      return;
    }

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

    const difference =
      cardCenter - containerCenter;

    container.scrollTo({
      left:
        container.scrollLeft + difference,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // ============================================================
  // KEEP CAROUSEL INSIDE MIDDLE COPY
  // ============================================================

  const normalizeIndex = (
    currentIndex: number
  ) => {
    const length = filtered.length;

    if (!length) {
      return currentIndex;
    }

    // If we've entered the third copy,
    // silently move to the equivalent
    // position in the middle copy.
    if (currentIndex >= length * 2) {
      return (
        length +
        (currentIndex % length)
      );
    }

    // If we've entered the first copy,
    // silently move to the equivalent
    // position in the middle copy.
    if (currentIndex < length) {
      return (
        length +
        (currentIndex % length)
      );
    }

    return currentIndex;
  };

  // ============================================================
  // UPDATE ACTIVE IMAGE
  // ============================================================

  const updateActiveIndex = () => {
    if (!filtered.length) {
      return;
    }

    const rawIndex =
      findCenterIndex();

    const normalizedIndex =
      normalizeIndex(rawIndex);

    // If normalization happened,
    // silently reposition the DOM.
    if (normalizedIndex !== rawIndex) {
      scrollToIndex(
        normalizedIndex,
        false
      );
    }

    if (
      activeIndexRef.current !==
      normalizedIndex
    ) {
      activeIndexRef.current =
        normalizedIndex;

      setActiveIndex(
        normalizedIndex
      );
    }
  };

  // ============================================================
  // SCROLL LISTENER
  // ============================================================

  useEffect(() => {
    const container =
      carouselRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      updateActiveIndex();
    };

    const handleResize = () => {
      updateActiveIndex();
    };

    container.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      }
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

    // updateActiveIndex intentionally uses
    // the current refs and filtered data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  // ============================================================
  // POSITION NEW CATEGORY IN MIDDLE COPY
  // ============================================================

  useEffect(() => {
    if (!filtered.length) {
      return;
    }

    const middleIndex =
      filtered.length;

    activeIndexRef.current =
      middleIndex;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToIndex(
          middleIndex,
          false
        );
      });
    });
  }, [
    activeCategory,
    filtered.length,
  ]);

  // ============================================================
  // AUTO SLIDESHOW
  // ============================================================

  useEffect(() => {
    if (!filtered.length) {
      return;
    }

    if (autoScrollRef.current) {
      clearInterval(
        autoScrollRef.current
      );
    }

    autoScrollRef.current =
      setInterval(() => {
        // Pause while mouse is over carousel.
        if (isPausedRef.current) {
          return;
        }

        const length =
          filtered.length;

        if (!length) {
          return;
        }

        const currentIndex =
          activeIndexRef.current;

        let nextIndex =
          currentIndex + 1;

        /*
         * Always move FORWARD.
         *
         * A → B → C → D → A → B...
         *
         * When reaching the third copy,
         * silently reposition to the middle copy.
         */

        if (
          nextIndex >=
          length * 2
        ) {
          const equivalentIndex =
            length +
            (currentIndex % length);

          scrollToIndex(
            equivalentIndex,
            false
          );

          activeIndexRef.current =
            equivalentIndex;

          setActiveIndex(
            equivalentIndex
          );

          nextIndex =
            equivalentIndex + 1;
        }

        activeIndexRef.current =
          nextIndex;

        setActiveIndex(
          nextIndex
        );

        scrollToIndex(
          nextIndex,
          true
        );
      }, 3500);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(
          autoScrollRef.current
        );

        autoScrollRef.current =
          null;
      }
    };
  }, [filtered.length]);

  // ============================================================
  // PAUSE / RESUME
  // ============================================================

  const pauseSlideshow = () => {
    isPausedRef.current = true;
  };

  const resumeSlideshow = () => {
    isPausedRef.current = false;
  };

  // ============================================================
  // MANUAL NAVIGATION
  // ============================================================

  const scrollToImage = (
    direction: 'left' | 'right'
  ) => {
    if (!filtered.length) {
      return;
    }

    const length =
      filtered.length;

    const currentIndex =
      activeIndexRef.current;

    let nextIndex: number;

    if (direction === 'right') {
      nextIndex =
        currentIndex + 1;

      if (
        nextIndex >=
        length * 2
      ) {
        nextIndex = length;
      }
    } else {
      nextIndex =
        currentIndex - 1;

      if (
        nextIndex < length
      ) {
        nextIndex =
          length * 2 - 1;
      }
    }

    activeIndexRef.current =
      nextIndex;

    setActiveIndex(
      nextIndex
    );

    scrollToIndex(
      nextIndex,
      true
    );
  };

  // ============================================================
  // CATEGORY CHANGE
  // ============================================================

  const handleCategoryChange = (
    category: string
  ) => {
    isPausedRef.current = false;

    setActiveCategory(
      category
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
            No photos uploaded yet.
            Check back soon.
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // MAIN
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
            {cat === 'all'
              ? 'All'
              : cat}
          </button>
        ))}
      </div>

      {/* ========================================================
          CAROUSEL
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
            duration: 0.35,
          }}
          className="relative"
        >
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
                className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:border-neon-pink hover:text-neon-pink lg:flex"
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
                className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:border-neon-pink hover:text-neon-pink lg:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* ==================================================
                  CAROUSEL VIEWPORT

                  IMPORTANT:
                  The slots remain stable.

                  The actual image card scales inside
                  the slot, giving the center-image effect
                  without changing the carousel geometry.
              =================================================== */}

              <div
                ref={carouselRef}
                onMouseEnter={
                  pauseSlideshow
                }
                onMouseLeave={
                  resumeSlideshow
                }
                className="gallery-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[calc(50vw-112px)] py-20 sm:gap-6 sm:px-[calc(50vw-128px)] sm:py-24 lg:gap-8 lg:px-[calc(50vw-144px)] lg:py-28"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle:
                    'none',
                }}
              >
                {carouselImages.map(
                  (img, index) => {
                    const rawDistance =
                      Math.abs(
                        index -
                          activeIndex
                      );

                    /*
                     * Only the nearby images
                     * need special scaling.
                     */

                    const distance =
                      Math.min(
                        rawDistance,
                        3
                      );

                    const scale =
                      distance === 0
                        ? 1.12
                        : distance === 1
                          ? 0.94
                          : distance === 2
                            ? 0.86
                            : 0.80;

                    const opacity =
                      distance === 0
                        ? 1
                        : distance === 1
                          ? 0.92
                          : distance === 2
                            ? 0.78
                            : 0.65;

                    return (
                      /*
                       * STABLE SLOT
                       *
                       * The slot never changes width/height.
                       * This prevents the carousel from jumping.
                       */
                      <div
                        key={`${img.id}-${index}`}
                        data-gallery-card
                        className="flex h-85 w-55 shrink-0 snap-center items-center justify-center sm:h-105 sm:w-70 lg:h-115 lg:w-75"
                      >
                        {/*
                         * VISUAL CARD
                         *
                         * This is the element that scales.
                         * Rounded corners + overflow hidden
                         * are on the same element.
                         */}
                        <motion.div
                          animate={{
                            scale,
                            opacity,
                          }}
                          transition={{
                            duration: 0.55,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          style={{
                            zIndex:
                              distance ===
                              0
                                ? 20
                                : 10 -
                                  distance,
                          }}
                          onClick={() =>
                            openImage(img)
                          }
                          className="group relative h-full w-full origin-center cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-black/20"
                        >
                          <Image
                            src={
                              img.image_url
                            }
                            alt={
                              img.alt_text
                            }
                            fill
                            sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 300px"
                            className="rounded-2xl object-contain"
                            priority={
                              index <
                              5
                            }
                          />

                          {/* No text overlay */}
                          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                        </motion.div>
                      </div>
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
            {/* CLOSE BUTTON */}

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

            {/* FULLSCREEN IMAGE */}

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
              className="relative flex max-h-[90vh] max-w-[95vw] items-center justify-center"
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
                className="max-h-[90vh] max-w-[95vw] w-auto rounded-2xl object-contain shadow-neon-glow"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}