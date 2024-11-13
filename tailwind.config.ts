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
          max: '480px',
        },
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
        cdvh: 'var(--viewport-height)',
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
