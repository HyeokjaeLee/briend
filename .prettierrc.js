module.exports = {
  singleQuote: true,
  semi: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 80,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/tailwind.css',
  tailwindFunctions: ['tw', 'cn', 'cva', 'twMerge', 'clsx'],
};
