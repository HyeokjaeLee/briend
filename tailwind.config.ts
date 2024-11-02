import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

import tailwindcssAnimated from 'tailwindcss-animated';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        slate: {
          350: '#93A5C8',
          750: '#243047',
          830: '#1A2232',
          850: '#111722',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#F0C160',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
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
