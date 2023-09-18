import type { Config } from 'tailwindcss';

const NAV_HEIGHT = '3.5rem';

const PAGE_HEIGHT = `calc(100vh - ${NAV_HEIGHT})`;

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
      },

      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      minWidth: {
        iPhoneSE: '375px',
      },

      height: {
        nav: NAV_HEIGHT,
        page: PAGE_HEIGHT,
      },
      minHeight: {
        page: PAGE_HEIGHT,
      },
      maxWidth: {
        page: '32rem',
      },
      padding: {
        page: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
