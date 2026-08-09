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
import {
  EVENT_TYPE_OPTIONS,
  PACKAGE_OPTIONS,
} from '@/lib/supabase/constants';

type ContactProps = {
  email: string;
  phone: string;
  instagram: string;
};

// Because EVENT_TYPE_OPTIONS uses `as const`,
// this creates the exact allowed event type union.
type EventType = (typeof EVENT_TYPE_OPTIONS)[number];

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  event_type: EventType;
  budget: string;
  package: string;
  message: string;
};

export default function Contact({
  email,
  phone,
  instagram,
}: ContactProps) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    event_type: EVENT_TYPE_OPTIONS[0],
    budget: '',
    package: '',
    message: '',
  });

  // ============================================================
  // FORM SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.package) {
      toast.error('Please select a package.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        event_type: form.event_type,
        budget: form.budget.trim() || null,
        package: form.package,
        message: form.message.trim() || null,
      });

      if (error) {
        console.error('Supabase inquiry error:', error);

        toast.error(
          'Something went wrong. Please try again or contact us directly.'
        );

        return;
      }

      setSent(true);

      toast.success('Got it! Sangram will reach out soon.');
    } catch (error) {
      console.error('Unexpected inquiry error:', error);

      toast.error(
        'Something went wrong. Please try again or contact us directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-charcoal py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">

        {/* =====================================================
            LEFT — CONTACT INFORMATION
        ====================================================== */}

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">
            Get In Touch
          </p>

          <h2 className="font-street text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            LET&apos;S CREATE
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
            Booking a shoot in Mayurbhanj or beyond? Fill out the form
            or reach out directly.
          </p>

          {/* Direct contact details */}
          <div className="mt-8 flex flex-col gap-4">

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-neon-pink"
            >
              <Mail className="h-5 w-5 shrink-0 text-neon-pink" />
              <span>{email}</span>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-neon-pink"
            >
              <Phone className="h-5 w-5 shrink-0 text-neon-pink" />
              <span>{phone}</span>
            </a>

            {/* Instagram */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-neon-pink"
            >
              <Camera className="h-5 w-5 shrink-0 text-neon-pink" />
              <span>@thelovabletimes</span>
            </a>
          </div>
        </div>

        {/* =====================================================
            RIGHT — BOOKING FORM
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-neon-pink/20 bg-grit p-6 sm:p-8"
        >
          {sent ? (

            /* =================================================
               SUCCESS MESSAGE
            ================================================== */

            <div className="flex min-h-125 flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-5 h-14 w-14 text-neon-pink" />

              <h3 className="font-street text-3xl text-white sm:text-4xl">
                MESSAGE SENT
              </h3>

              <p className="mt-3 max-w-sm text-white/60">
                Thank you for reaching out. Sangram typically replies
                within 24 hours.
              </p>
            </div>

          ) : (

            /* =================================================
               CONTACT FORM
            ================================================== */

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* =================================================
                  NAME
              ================================================== */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-neon-pink"
                />
              </div>

              {/* =================================================
                  EMAIL + PHONE
              ================================================== */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-neon-pink"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="Phone (optional)"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-neon-pink"
                  />
                </div>
              </div>

              {/* =================================================
                  EVENT TYPE
              ================================================== */}

              <div>
                <label
                  htmlFor="event_type"
                  className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                >
                  Event Type
                </label>

                <select
                  id="event_type"
                  required
                  value={form.event_type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      event_type: e.target.value as EventType,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none transition focus:border-neon-pink"
                >
                  {EVENT_TYPE_OPTIONS.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-charcoal text-white"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* =================================================
                  ESTIMATED BUDGET
              ================================================== */}

              <div>
                <label
                  htmlFor="budget"
                  className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                >
                  Estimated Budget
                </label>

                <input
                  id="budget"
                  type="text"
                  placeholder="e.g. ₹50,000 – ₹1,00,000"
                  value={form.budget}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      budget: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-neon-pink"
                />
              </div>

              {/* =================================================
                  PACKAGE
              ================================================== */}

              <div>
                <label
                  htmlFor="package"
                  className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                >
                  Which Package Interests You?
                </label>

                <select
                  id="package"
                  required
                  value={form.package}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      package: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none transition focus:border-neon-pink"
                >
                  <option
                    value=""
                    disabled
                    className="bg-charcoal text-white"
                  >
                    Select a package...
                  </option>

                  {PACKAGE_OPTIONS.map((pkg) => (
                    <option
                      key={pkg.value}
                      value={pkg.value}
                      className="bg-charcoal text-white"
                    >
                      {pkg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* =================================================
                  MESSAGE
              ================================================== */}

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs uppercase tracking-widest text-white/50"
                >
                  Tell Us More
                </label>

                <textarea
                  id="message"
                  placeholder="Tell us about your shoot, date, venue, or anything else..."
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-neon-pink"
                />
              </div>

              {/* =================================================
                  SUBMIT BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neon-pink py-3.5 font-semibold uppercase tracking-widest text-charcoal transition hover:shadow-neon-glow disabled:cursor-not-allowed disabled:opacity-50"
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