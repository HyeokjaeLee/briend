import type { Config } from 'tailwindcss';

import type { CSSProperties } from 'react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
    ({
      addUtilities,
    }: {
      addUtilities: (
        utilities: Record<string, Record<string, string>>,
        options?: string[],
      ) => void;
    }) => {
      const utilities = {
        '.hide-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      };

      addUtilities(utilities, ['responsive', 'hover']);
    },
    require('tailwindcss-animated'),
  ],
};
export default config;
