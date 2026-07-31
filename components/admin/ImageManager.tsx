'use client';

import { useState } from 'react';
import Image from 'next/image';
import { deleteImage } from '@/app/admin/actions';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ConfirmDialog from './ConfirmDialog';
import type { GalleryImage } from '@/types/database';

export default function ImageManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pending) return;
    setDeleting(true);

    const result = await deleteImage(pending.id, pending.storage_path);
    setDeleting(false);
    setPending(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Photo deleted.');
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-neon-pink/20 bg-grit p-6">
      <h3 className="mb-4 font-street text-xl text-white">
        Manage Gallery ({images.length})
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-lg">
            <Image
              src={img.image_url}
              alt={img.alt_text}
              width={200}
              height={200}
              className="h-32 w-full object-cover"
            />
            <button
              onClick={() => setPending(img)}
              className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="h-6 w-6 text-neon-pink" />
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pending}
        title="Delete this photo?"
        description="This will permanently remove the image from your gallery and storage. This can't be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}