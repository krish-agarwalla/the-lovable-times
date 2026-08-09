// lib/export.ts
import * as XLSX from 'xlsx';
import { packageLabel } from '@/lib/supabase/constants';
import type { Inquiry } from '@/types/database';

// Shared row-shaping logic so CSV and XLSX always match exactly
function toExportRows(inquiries: Inquiry[]) {
  return inquiries.map((inq) => ({
    'Name': inq.name,
    'Email': inq.email,
    'Phone': inq.phone ?? '',
    'Event Type': inq.event_type,
    'Budget': inq.budget ?? '',
    'Package': packageLabel(inq.package),
    'Message': inq.message ?? '',
    'Status': inq.status,
    'Submitted On': new Date(inq.created_at).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

// Escapes a value for safe CSV inclusion (handles commas, quotes, newlines)
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInquiriesToCSV(inquiries: Inquiry[], fileLabel: string) {
  const rows = toExportRows(inquiries);

  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => csvEscape(String(row[h as keyof typeof row]))).join(',')
    ),
  ];

  // Prepend BOM so Excel opens special characters (₹, etc.) correctly
  const csvContent = '\uFEFF' + csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  triggerDownload(blob, `Inquiries-${fileLabel}.csv`);
}

export function exportInquiriesToXLSX(inquiries: Inquiry[], fileLabel: string) {
  const rows = toExportRows(inquiries);

  if (rows.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set reasonable column widths so it's readable on open, not squished
  worksheet['!cols'] = [
    { wch: 20 }, // Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 18 }, // Event Type
    { wch: 18 }, // Budget
    { wch: 35 }, // Package
    { wch: 40 }, // Message
    { wch: 12 }, // Status
    { wch: 20 }, // Submitted On
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiries');

  XLSX.writeFile(workbook, `Inquiries-${fileLabel}.xlsx`);
}