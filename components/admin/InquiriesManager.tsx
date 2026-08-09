"use client";

import { useState } from "react";
import { updateInquiryStatus, deleteInquiry } from "@/app/admin/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2, Mail, Phone, Wallet, Package } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { PACKAGE_OPTIONS } from "@/lib/supabase/constants";
import type { Inquiry } from "@/types/database";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-neon-pink text-charcoal",
  contacted: "bg-yellow-400 text-charcoal",
  booked: "bg-green-400 text-charcoal",
  closed: "bg-white/20 text-white",
};

// Convert stored value (e.g. "luxury_wedding") back to its readable label
function packageLabel(value: string | null) {
  if (!value) return null;
  return PACKAGE_OPTIONS.find((p) => p.value === value)?.label ?? value;
}

export default function InquiriesManager({
  inquiries,
}: {
  inquiries: Inquiry[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState<Inquiry | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateInquiryStatus(id, status);
    if (result.error) return toast.error(result.error);
    toast.success("Status updated.");
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!pending) return;
    const result = await deleteInquiry(pending.id);
    setPending(null);
    if (result.error) return toast.error(result.error);
    toast.success("Inquiry deleted.");
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-neon-pink/20 bg-grit p-6">
      <h3 className="mb-4 font-street text-xl text-white">
        Booking Inquiries ({inquiries.length})
      </h3>

      <div className="space-y-3">
        {inquiries.length === 0 && (
          <p className="text-sm text-white/40">No inquiries yet.</p>
        )}

        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="rounded-lg border border-white/10 bg-charcoal p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="font-semibold text-white">{inq.name}</p>
                <p className="text-xs text-white/40">{inq.event_type}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${STATUS_COLORS[inq.status]}`}
              >
                {inq.status}
              </span>
            </div>

            {inq.message && (
              <p className="mb-3 text-sm text-white/70">{inq.message}</p>
            )}

            {/* Budget + Package — the new fields */}
            <div className="mb-3 space-y-1 rounded-lg bg-grit p-3">
              {inq.budget && (
                <p className="flex items-center gap-2 text-xs text-white/70">
                  <Wallet className="h-3.5 w-3.5 text-neon-pink" />
                  Budget: {inq.budget}
                </p>
              )}
              {inq.package && (
                <p className="flex items-center gap-2 text-xs text-white/70">
                  <Package className="h-3.5 w-3.5 text-neon-pink" />
                  {packageLabel(inq.package)}
                </p>
              )}
            </div>

            <div className="mb-3 flex flex-wrap gap-3 text-xs text-white/50">
              <a
                href={`mailto:${inq.email}`}
                className="flex items-center gap-1 hover:text-neon-pink"
              >
                <Mail className="h-3 w-3" /> {inq.email}
              </a>
              {inq.phone && (
                <a
                  href={`tel:${inq.phone}`}
                  className="flex items-center gap-1 hover:text-neon-pink"
                >
                  <Phone className="h-3 w-3" /> {inq.phone}
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={inq.status}
                onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                className="rounded-lg border border-white/10 bg-grit px-3 py-1 text-xs text-white outline-none"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => setPending(inq)}
                className="ml-auto text-white/40 hover:text-neon-pink"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pending}
        title="Delete this inquiry?"
        description={`This removes "${pending?.name}"'s inquiry permanently. This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
