import { useEffect } from 'react';

export const useScrollListener = () => {
  useEffect(() => {
    const handleScroll = (e: Event) => {
      window.scrollTo({ top: 0 });
      e.stopPropagation();
      e.preventDefault();
    };

    window.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
