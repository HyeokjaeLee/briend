import dynamic from 'next/dynamic';

export const createOnlyClientComponent = <T extends object>(
  Component: React.ComponentType<T>,
) => {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  });
};
