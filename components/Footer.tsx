export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-sm text-white/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        
        {/* Left */}
        <p>
          © {new Date().getFullYear()} The Lovable Times — Sangram AJ. All rights
          reserved. Rairangpur, Mayurbhanj, Odisha.
        </p>

        {/* Right */}
        <p className="shrink-0">
          Designed with ❤️ by{" "}
          <a
            href="mailto:krishagarwalla24@gmail.com"
            className="text-white/60 transition-colors duration-300 hover:text-white"
          >
            Krish Agarwalla
          </a>
        </p>
      </div>
    </footer>
  );
}