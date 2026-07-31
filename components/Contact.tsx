'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Mail,
  Phone,
  Camera,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const EVENT_TYPES = [
  'Wedding',
  'Portrait',
  'Street/Editorial',
  'Event',
  'Other',
];

export default function Contact({
  email,
  phone,
  instagram,
}: {
  email: string;
  phone: string;
  instagram: string;
}) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: 'Wedding',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.from('inquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      event_type: form.event_type,
      message: form.message || null,
    });

    setLoading(false);

    if (error) {
      toast.error('Something went wrong. Try WhatsApp instead.');
      return;
    }

    setSent(true);

    setForm({
      name: '',
      email: '',
      phone: '',
      event_type: 'Wedding',
      message: '',
    });

    toast.success('Got it! Sangram will reach out soon.');
  };

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        {/* Left Side */}
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-neon-pink">
            Get In Touch
          </p>

          <h2 className="mb-6 font-street text-4xl text-white sm:text-5xl">
            LET&apos;S <span className="text-hot-pink">CREATE</span>
          </h2>

          <p className="mb-8 text-white/60">
            Booking a shoot in Mayurbhanj or beyond? Fill out the form or
            contact Sangram directly.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-white/80 transition hover:text-neon-pink"
            >
              <Mail className="h-5 w-5 text-neon-pink" />
              <span>{email}</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 text-white/80 transition hover:text-neon-pink"
            >
              <Phone className="h-5 w-5 text-neon-pink" />
              <span>{phone}</span>
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 transition hover:text-neon-pink"
            >
              <Camera className="h-5 w-5 text-neon-pink" />
              <span>@thelovabletimes</span>
            </a>
          </div>
        </div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neon-pink/20 bg-grit p-8"
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-neon-pink" />

              <h3 className="font-street text-2xl text-white">
                MESSAGE SENT
              </h3>

              <p className="mt-2 text-white/60">
                Sangram typically replies within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none focus:border-neon-pink"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none focus:border-neon-pink"
                />

                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none focus:border-neon-pink"
                />
              </div>

              <select
                value={form.event_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    event_type: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none focus:border-neon-pink"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <textarea
                rows={4}
                placeholder="Tell me about your shoot..."
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none focus:border-neon-pink"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neon-pink py-3 font-semibold uppercase tracking-widest text-charcoal transition hover:shadow-neon-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />

                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}