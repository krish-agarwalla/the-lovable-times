'use client';

import { useMemo, useState } from 'react';
import { FileSpreadsheet, FileText, CalendarRange } from 'lucide-react';
import { toast } from 'sonner';
import { exportInquiriesToCSV, exportInquiriesToXLSX } from '@/lib/supabase/export';
import type { Inquiry } from '@/types/database';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function InquiryExport({ inquiries }: { inquiries: Inquiry[] }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [year, setYear] = useState(now.getFullYear());

  // Build a year list from the earliest inquiry on record through
  // next year, so the dropdown always covers real data + a bit of
  // headroom — never hardcoded to go stale.
  const years = useMemo(() => {
    const dataYears = inquiries.map((inq) => new Date(inq.created_at).getFullYear());
    const earliest = dataYears.length ? Math.min(...dataYears) : now.getFullYear();
    const latest = Math.max(now.getFullYear() + 1, ...dataYears);

    const list: number[] = [];
    for (let y = latest; y >= earliest; y--) list.push(y);
    return list;
  }, [inquiries, now]);

  // Filter inquiries down to the selected month + year
  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const d = new Date(inq.created_at);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [inquiries, month, year]);

  const fileLabel = `${MONTHS[month]}-${year}`; // e.g. "June-2026"
  const displayLabel = `${MONTHS[month]} ${year}`; // e.g. "June 2026"

  const handleExport = (format: 'csv' | 'xlsx') => {
    if (filtered.length === 0) {
      toast.error(`No inquiries found for ${displayLabel}.`);
      return;
    }

    if (format === 'csv') {
      exportInquiriesToCSV(filtered, fileLabel);
    } else {
      exportInquiriesToXLSX(filtered, fileLabel);
    }

    toast.success(`Exported ${filtered.length} inquiries from ${displayLabel}.`);
  };

  return (
    <div className="rounded-2xl border border-neon-pink/20 bg-grit p-6">
      <h3 className="mb-4 flex items-center gap-2 font-street text-xl text-white">
        <CalendarRange className="h-5 w-5 text-neon-pink" /> Export Inquiries
      </h3>

      <p className="mb-4 text-sm text-white/50">
        Pick a month and year to download that period&apos;s leads as a spreadsheet.
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-charcoal px-3 py-2 text-sm text-white outline-none focus:border-neon-pink"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-charcoal px-3 py-2 text-sm text-white outline-none focus:border-neon-pink"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview count — tells Sangram what he's about to download
          before he commits to a file */}
      <p className="mb-4 text-xs text-white/40">
        {filtered.length === 0
          ? `No inquiries in ${displayLabel}.`
          : `${filtered.length} inquiry${filtered.length === 1 ? '' : 's'} found for ${displayLabel}.`}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => handleExport('csv')}
          disabled={filtered.length === 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 py-2 text-sm font-semibold uppercase tracking-widest text-white/80 transition hover:border-neon-pink hover:text-neon-pink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FileText className="h-4 w-4" /> CSV
        </button>

        <button
          onClick={() => handleExport('xlsx')}
          disabled={filtered.length === 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-neon-pink py-2 text-sm font-semibold uppercase tracking-widest text-charcoal transition hover:shadow-neon-glow disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FileSpreadsheet className="h-4 w-4" /> Excel
        </button>
      </div>
    </div>
  );
}