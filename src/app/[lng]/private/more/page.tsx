'use client';

import { CustomLink } from '@/components/CustomLink';
import { useCustomRouter } from '@/hooks/useCustomRouter';

const MorePage = () => {
  const router = useCustomRouter();

  return (
    <div className="flex flex-col gap-2">
      more
      <CustomLink href="?test=1">push</CustomLink>
      <CustomLink replace href="?test=2">
        replace
      </CustomLink>
      <button
        onClick={() => {
          router.back();
        }}
      >
        back
      </button>
      <button
        onClick={() => {
          router.forward();
        }}
      >
        forward
      </button>
    </div>
  );
};

export default MorePage;
