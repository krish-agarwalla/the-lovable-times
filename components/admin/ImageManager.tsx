'use client';

import Image from 'next/image';
import { deleteImage } from '@/app/admin/actions';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { GalleryImage } from '@/types/database';

export default function ImageManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm('Delete this photo permanently?')) return;

    const result = await deleteImage(id, storagePath);
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
              onClick={() => handleDelete(img.id, img.storage_path)}
              className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="h-6 w-6 text-neon-pink" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}