import { memo } from 'react';

import SvgLogo from '@/svgs/logo.svg';
import { cn } from '@/utils';
export interface LogoProps {
  className?: string;
}

export const Logo = memo(({ className }: LogoProps) => (
  <SvgLogo className={cn('text-slate-900', className)} />
));

Logo.displayName = 'Logo';
