'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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

  /*
   * We render 3 copies of the same images.
   *
   * Example:
   *
   * [1 2 3 4] [1 2 3 4] [1 2 3 4]
   *             ↑
   *        starting area
   *
   * This allows us to keep moving in one direction
   * while seamlessly jumping back to the middle copy.
   */
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
  // OPEN / CLOSE IMAGE
  // ============================================================

  const openImage = (
    image: GalleryImage
  ) => {
    setSelected(image);
  };

  const closeImage = () => {
    setSelected(null);
  };

  // ============================================================
  // FIND CENTER IMAGE
  // ============================================================

  const findCenterIndex = () => {
    const container =
      carouselRef.current;

    if (!container) return 0;

    const cards =
      container.querySelectorAll<HTMLElement>(
        '[data-gallery-card]'
      );

    if (!cards.length) return 0;

    const containerRect =
      container.getBoundingClientRect();

    const containerCenter =
      containerRect.left +
      containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach(
      (card, index) => {
        const rect =
          card.getBoundingClientRect();

        const cardCenter =
          rect.left +
          rect.width / 2;

        const distance =
          Math.abs(
            containerCenter -
              cardCenter
          );

        if (
          distance <
          closestDistance
        ) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    );

    return closestIndex;
  };

  // ============================================================
  // SCROLL TO INDEX
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

    const difference =
      cardCenter -
      containerCenter;

    container.scrollTo({
      left:
        container.scrollLeft +
        difference,
      behavior: smooth
        ? 'smooth'
        : 'auto',
    });
  };

  // ============================================================
  // INFINITE LOOP HANDLER
  // ============================================================

  const handleInfiniteLoop = (
    currentIndex: number
  ) => {
    const originalLength =
      filtered.length;

    if (!originalLength) {
      return currentIndex;
    }

    /*
     * We want to stay inside the middle copy:
     *
     * COPY 1       COPY 2       COPY 3
     * 0...n-1      n...2n-1     2n...3n-1
     *
     * If the user/auto-scroll reaches COPY 3,
     * instantly move to the equivalent image
     * inside COPY 2.
     */

    if (
      currentIndex >=
      originalLength * 2
    ) {
      const equivalentIndex =
        originalLength +
        (currentIndex %
          originalLength);

      scrollToIndex(
        equivalentIndex,
        false
      );

      return equivalentIndex;
    }

    /*
     * Also protect the left side if the user
     * manually swipes too far backwards.
     */
    if (
      currentIndex <
      originalLength
    ) {
      const equivalentIndex =
        originalLength +
        (currentIndex %
          originalLength);

      scrollToIndex(
        equivalentIndex,
        false
      );

      return equivalentIndex;
    }

    return currentIndex;
  };

  // ============================================================
  // UPDATE CENTER IMAGE
  // ============================================================

  const updateActiveIndex = () => {
    if (!filtered.length) return;

    const rawIndex =
      findCenterIndex();

    const correctedIndex =
      handleInfiniteLoop(
        rawIndex
      );

    if (
      activeIndexRef.current !==
      correctedIndex
    ) {
      activeIndexRef.current =
        correctedIndex;

      setActiveIndex(
        correctedIndex
      );
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  // ============================================================
  // POSITION CAROUSEL IN MIDDLE COPY
  // ============================================================

  useEffect(() => {
    if (!filtered.length) {
      return;
    }

    const middleIndex =
      filtered.length;

    activeIndexRef.current =
      middleIndex;

    /*
     * Wait until the new category has rendered.
     * This effect does NOT call setState.
     * It only moves the DOM scroll position.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToIndex(
          middleIndex,
          false
        );
      });
    });
  }, [activeCategory, filtered.length]);

  // ============================================================
  // AUTO SLIDESHOW
  // ============================================================

  useEffect(() => {
    if (filtered.length <= 0) {
      return;
    }

    const startAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(
          autoScrollRef.current
        );
      }

      autoScrollRef.current =
        setInterval(() => {
          /*
           * IMPORTANT:
           * If user is hovering an image,
           * don't move the carousel.
           */
          if (isPausedRef.current) {
            return;
          }

          const currentIndex =
            activeIndexRef.current;

          const originalLength =
            filtered.length;

          let nextIndex =
            currentIndex + 1;

          /*
           * We always move FORWARD.
           *
           * When we reach the end of the
           * middle copy, jump to the
           * equivalent position in the
           * middle copy.
           */
          if (
            nextIndex >=
            originalLength * 2
          ) {
            const equivalentIndex =
              originalLength +
              (
                currentIndex %
                originalLength
              );

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
    };

    startAutoScroll();

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
  // PAUSE ON HOVER
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

    const originalLength =
      filtered.length;

    const currentIndex =
      activeIndexRef.current;

    let nextIndex: number;

    if (direction === 'right') {
      nextIndex =
        currentIndex + 1;

      if (
        nextIndex >=
        originalLength * 2
      ) {
        nextIndex =
          originalLength;
      }
    } else {
      nextIndex =
        currentIndex - 1;

      if (
        nextIndex <
        originalLength
      ) {
        nextIndex =
          originalLength * 2 - 1;
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
    /*
     * Stop current slideshow position
     * while the new category renders.
     */
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
              handleCategoryChange(
                cat
              )
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
                  scrollToImage(
                    'left'
                  )
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
                  scrollToImage(
                    'right'
                  )
                }
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:border-neon-pink hover:text-neon-pink lg:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* ==================================================
                  HORIZONTAL INFINITE CAROUSEL
              =================================================== */}

              <div
                ref={carouselRef}
                onMouseEnter={
                  pauseSlideshow
                }
                onMouseLeave={
                  resumeSlideshow
                }
                className="gallery-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50vw-120px)] pb-10 sm:gap-6 sm:px-[calc(50vw-150px)] lg:gap-8 lg:px-[calc(50vw-180px)]"
                style={{
                  scrollbarWidth:
                    'none',
                  msOverflowStyle:
                    'none',
                }}
              >
                {carouselImages.map(
                  (img, index) => {
                    const distance =
                      Math.abs(
                        index -
                          activeIndex
                      );

                    /*
                     * Center:
                     * 1.12
                     *
                     * One image away:
                     * 0.94
                     *
                     * Two images away:
                     * 0.86
                     *
                     * Further:
                     * 0.80
                     */
                    let scale = 0.8;

                    if (
                      distance === 0
                    ) {
                      scale = 1.12;
                    } else if (
                      distance === 1
                    ) {
                      scale = 0.94;
                    } else if (
                      distance === 2
                    ) {
                      scale = 0.86;
                    }

                    return (
                      <motion.div
                        key={`${img.id}-${index}`}
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
                        /*
                         * CLICK ONLY opens image.
                         *
                         * Hover does NOT open it.
                         */
                        onClick={() =>
                          openImage(img)
                        }
                        className="group relative w-60 shrink-0 cursor-pointer snap-center rounded-2xl border border-white/10 bg-black/20 sm:w-75 lg:w-90"
                      >
                        {/* =================================================
                            IMAGE
                        ================================================== */}

                        <div className="relative aspect-3/4 overflow-hidden">
                          <Image
                            src={img.image_url}
                            alt={img.alt_text}
                            width={600}
                            height={800}
                            sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 360px"
                            className="block h-auto w-full rounded-2xl object-contain transition-transform duration-700"
                          />

                          {/* =================================================
                              SUBTLE HOVER
                          ================================================== */}

                          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                          {/* =================================================
                              CATEGORY LABEL
                              Appears at bottom on hover.
                              Remove this block too if you don't want
                              the category name displayed.
                          ================================================== */}

                          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-12 transition-transform duration-500 group-hover:translate-y-0">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                              {
                                img.category
                              }
                            </span>
                          </div>
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
            onClick={
              closeImage
            }
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