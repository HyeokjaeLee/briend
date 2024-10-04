import type { Config } from 'tailwindcss';

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
