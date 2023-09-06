export const isServerSide = () =>
  typeof window === 'undefined' ||
  typeof localStorage === 'undefined' ||
  typeof document === 'undefined';
