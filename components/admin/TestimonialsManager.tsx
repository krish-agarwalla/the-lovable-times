'use client';

import { useRef, useState } from 'react';
import { addTestimonial, deleteTestimonial } from '@/app/admin/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Trash2, Star } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import type { Testimonial } from '@/types/database';

export default function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState<Testimonial | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await addTestimonial(formData);
    if (result.error) return toast.error(result.error);
    toast.success('Testimonial added.');
    formRef.current?.reset();
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!pending) return;
    const result = await deleteTestimonial(pending.id);
    setPending(null);
    if (result.error) return toast.error(result.error);
    toast.success('Deleted.');
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-neon-pink/20 bg-grit p-6">
      <h3 className="mb-4 font-street text-xl text-white">Testimonials</h3>

      <form ref={formRef} onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          name="client_name"
          placeholder="Client name"
          required
          className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none focus:border-neon-pink"
        />
        <textarea
          name="quote"
          placeholder="What did they say?"
          required
          rows={2}
          className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none focus:border-neon-pink"
        />
        <select
          name="rating"
          defaultValue="5"
          className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} stars
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full rounded-full bg-neon-pink py-2 text-sm font-semibold uppercase tracking-widest text-charcoal hover:shadow-neon-glow"
        >
          Add Testimonial
        </button>
      </form>

      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-start justify-between rounded-lg border border-white/10 bg-charcoal p-3">
            <div>
              <p className="text-sm font-semibold text-white">{t.client_name}</p>
              <p className="text-xs text-white/50">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-neon-pink text-neon-pink" />
                ))}
              </div>
            </div>
            <button
              onClick={() => setPending(t)}
              className="text-white/40 hover:text-neon-pink"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pending}
        title="Delete testimonial?"
        description={`Remove ${pending?.client_name}'s review from your site permanently.`}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}