import { Mail, Phone, Camera } from "lucide-react";

export default function Contact({
  email,
  phone,
  instagram,
}: {
  email: string;
  phone: string;
  instagram: string;
}) {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-neon-pink/20 bg-grit p-10 text-center">
        <h2 className="mb-4 font-street text-4xl text-white sm:text-5xl">
          LET&apos;S <span className="text-neon-pink">CREATE</span>
        </h2>

        <p className="mb-8 text-white/60">
          Booking a shoot in Mayurbhanj or beyond? Reach out.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 rounded-full border border-neon-pink/40 px-6 py-3 text-white transition hover:bg-neon-pink hover:text-charcoal"
          >
            <Mail className="h-4 w-4" />
            {email}
          </a>

          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 rounded-full border border-neon-pink/40 px-6 py-3 text-white transition hover:bg-neon-pink hover:text-charcoal"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>

          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-neon-pink/40 px-6 py-3 text-white transition hover:bg-neon-pink hover:text-charcoal"
          >
            <Camera className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}