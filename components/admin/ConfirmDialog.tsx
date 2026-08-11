'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          className="fixed inset-0 z-9999 grid place-items-center bg-black/80 p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-neon-pink/30 bg-grit p-6 shadow-neon-glow"
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    danger
                      ? 'bg-neon-pink/15 text-neon-pink'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <h3 className="font-street text-xl tracking-wide text-white">
                  {title}
                </h3>
              </div>

              <button
                onClick={onCancel}
                aria-label="Close"
                className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <p className="mb-8 text-sm leading-relaxed text-white/60">
              {description}
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/70 transition hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                  danger
                    ? 'bg-neon-pink text-charcoal hover:shadow-neon-glow'
                    : 'bg-paper text-charcoal hover:bg-paper/90'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}