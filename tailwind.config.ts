import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#F7F1E8',
        grit: '#EFE5D8',

        'neon-pink': '#8E1F2D',
        'hot-pink': '#A92E3D',
        'pastel-pink': '#E8C9C4',

        champagne: '#C8A56A',

        // ─────────────────────────────────────────────
        // OVERRIDE Tailwind's built-in "white" and "black"
        // tokens. Every text-white, border-white/10,
        // bg-white/5, text-black, bg-black/70, etc. across
        // EVERY component now resolves to these values
        // instead of true white/black — with all opacity
        // modifiers (/80, /60, /10...) still working
        // correctly since they're just alpha blends.
        // ─────────────────────────────────────────────
        white: '#8E1F2D',   // was pure white → now your deep red
        black: '#3A1418',   // was pure black → now a dark maroon-brown for overlays/shadows

        // Genuine white is still needed in a few spots
        // (e.g. the logo circle background). Use this
        // instead of "white" wherever you actually mean
        // literal white, not "main text color".
        paper: '#FFFFFF',
      },

      fontFamily: {
        street: ['var(--font-street)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },

      boxShadow: {
        'neon-glow': '0 0 25px rgba(142, 31, 45, 0.20)',
      },

      backgroundImage: {
        grain:
          "url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')",
      },
    },
  },
  plugins: [],
};

export default config;