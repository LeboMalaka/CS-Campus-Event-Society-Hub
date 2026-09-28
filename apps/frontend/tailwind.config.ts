import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        bg: {
          dark: '#0f0f13',
          card: '#17171d',
          panel: '#1f1f29',
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(168, 85, 247, 0.35), 0 12px 30px rgba(147, 51, 234, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
