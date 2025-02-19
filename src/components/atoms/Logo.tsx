import { memo } from 'react';

import SvgLogo from '@/svgs/logo.svg';
export interface LogoProps {
  className?: string;
}

export const Logo = memo(({ className }: LogoProps) => (
  <SvgLogo className={className} />
));

Logo.displayName = 'Logo';
