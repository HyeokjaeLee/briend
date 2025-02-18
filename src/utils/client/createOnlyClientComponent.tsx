import type { DynamicOptionsLoadingProps } from 'next/dynamic';
import dynamic from 'next/dynamic';

export const createOnlyClientComponent = <T extends object>(
  Component: React.ComponentType<T>,
  loading?:
    | ((loadingProps: DynamicOptionsLoadingProps) => React.ReactElement | null)
    | undefined,
) => {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading,
  });
};
