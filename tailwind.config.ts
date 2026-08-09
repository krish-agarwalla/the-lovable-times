import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── OPTION A: Deep Espresso (currently active) ──
        charcoal: '#1a1114',   // was #0a0a0a (pure black) → now a deep warm espresso-brown
        grit: '#271a1e',       // was #161616 → warmer, slightly lighter card background

        // ── OPTION B: Midnight Plum (swap in if you prefer this) ──
        // charcoal: '#180f18',
        // grit: '#241628',

        'neon-pink': '#ff2d78',
        'hot-pink': '#ff5fa2',
        'pastel-pink': '#ffc2dd',

        // New: a warm gold-ish accent for subtle premium touches
        // (optional — use sparingly, e.g. on borders/dividers)
        champagne: '#e8c9a8',
      },
      fontFamily: {
        street: ['var(--font-street)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 25px rgba(255, 45, 120, 0.55)',
      },
      backgroundImage: {
        grain: "url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')",
      },
    },
  },
  plugins: [],
};

export default config;