'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[200]lex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-neon-pink/30 bg-grit p-6 shadow-neon-glow"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    danger ? 'bg-neon-pink/15 text-neon-pink' : 'bg-white/10 text-white'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="font-street text-lg tracking-wide text-white">
                  {title}
                </h3>
              </div>
              <button
                onClick={onCancel}
                className="text-white/40 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6 text-sm text-white/60">{description}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                  danger
                    ? 'bg-neon-pink text-charcoal hover:shadow-neon-glow'
                    : 'bg-white text-charcoal hover:bg-white/90'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}