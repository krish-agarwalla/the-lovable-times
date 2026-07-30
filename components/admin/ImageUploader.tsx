'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/app/admin/actions';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ImageUploader() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await uploadImage(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Photo uploaded to the gallery.');
    formRef.current?.reset();
    router.refresh();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neon-pink/20 bg-grit p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 font-street text-xl text-white">
        <UploadCloud className="h-5 w-5 text-neon-pink" /> Upload Photo
      </h3>

      <input
        type="file"
        name="file"
        accept="image/*"
        required
        className="mb-3 block w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-neon-pink file:px-4 file:py-2 file:font-semibold file:text-charcoal"
      />

      <input
        type="text"
        name="category"
        placeholder="Category (e.g. wedding, street, portrait)"
        className="mb-3 w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none focus:border-neon-pink"
      />

      <input
        type="text"
        name="altText"
        placeholder="Alt text (for accessibility/SEO)"
        className="mb-4 w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none focus:border-neon-pink"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-neon-pink py-2 font-semibold uppercase tracking-widest text-charcoal transition hover:shadow-neon-glow disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}