import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

import tailwindcssAnimated from 'tailwindcss-animated';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: {
          min: '480px',
        },
      },
      keyframes: {
        'shake-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%': { transform: 'translateX(10px)' },
          '80%': { transform: 'translateX(8px)' },
          '90%': { transform: 'translateX(-8px)' },
        },
      },
      animation: {
        shake:
          'shake-horizontal var(--tw-animate-duration, 1s) cubic-bezier(0.455, 0.030, 0.515, 0.955) var(--tw-animate-delay, 0s) both',
      },
      boxShadow: {
        'lg-left':
          '-10px 0 15px -3px rgb(0 0 0 / 0.03), -4px 0 6px -4px rgb(0 0 0 / 0.02)',
        'lg-right':
          '10px 0 15px -3px rgb(0 0 0 / 0.03), 4px 0 6px -4px rgb(0 0 0 / 0.02)',
        'lg-top':
          '0 -10px 15px -3px rgb(0 0 0 / 0.03), 0 -4px 6px -4px rgb(0 0 0 / 0.02)',
      },
      colors: {
        'naver-green': '#03C75A',
        'kakao-yellow': '#FEE500',
        sky: {
          50: '#E6EDFB',
          500: '#0090FF',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#F0C160',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
        bmdohyeon: ['var(--font-bmdohyeon)'],
      },
      spacing: {
        '14.4': '3.6rem',
        '17': '4.25rem',
        cdvh: 'var(--viewport-height)',
        cdch: 'var(--content-height)',
      },
    },
  },
  plugins: [
    ({ addUtilities }: PluginAPI) => {
      const utilities = {
        '.hide-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.flex-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      };

      addUtilities(utilities, {
        respectPrefix: true,
        respectImportant: true,
      });
    },

    tailwindcssAnimated,
  ],
};
export default config;
