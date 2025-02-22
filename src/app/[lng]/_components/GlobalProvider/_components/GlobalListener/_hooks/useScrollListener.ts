import { useEffect } from 'react';

export const useScrollListener = () => {
  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault();
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
