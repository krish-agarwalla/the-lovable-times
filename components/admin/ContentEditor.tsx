'use client';

import { useState } from 'react';
import { updateContent } from '@/app/admin/actions';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import type { SiteContent } from '@/types/database';

const FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: 'hero_tagline', label: 'Hero Tagline' },
  { key: 'hero_subtext', label: 'Hero Subtext' },
  { key: 'about_text', label: 'About Text', multiline: true },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'contact_phone', label: 'Contact Phone' },
  { key: 'contact_instagram', label: 'Instagram URL' },
];

export default function ContentEditor({ content }: { content: SiteContent[] }) {
  const initial = content.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (key: string) => {
    setSaving(key);
    const result = await updateContent(key, values[key] ?? '');
    setSaving(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Updated.');
  };

  return (
    <div className="rounded-2xl border border-neon-pink/20 bg-grit p-6">
      <h3 className="mb-4 font-street text-xl text-white">Edit Site Text</h3>

      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
              {field.label}
            </label>
            <div className="flex gap-2">
              {field.multiline ? (
                <textarea
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    setValues({ ...values, [field.key]: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none focus:border-neon-pink"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    setValues({ ...values, [field.key]: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2 text-white outline-none focus:border-neon-pink"
                />
              )}
              <button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                className="flex items-center gap-1 rounded-lg bg-neon-pink px-4 py-2 text-sm font-semibold text-charcoal hover:shadow-neon-glow disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}