import Link from 'next/link';

import { RiArrowGoBackFill } from 'react-icons/ri';

import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { CustomTopHeader } from '@/components/atoms/CustomTopHeader';
import type { LANGUAGE } from '@/constants/language';
import { LANGUAGE_FLAG } from '@/constants/language';
import { ROUTES } from '@/routes/client';
import { Switch } from '@radix-ui/themes';

interface ChattingTopNavProps {
  otherName: string;
  isMyLanguage: boolean;
  onToggleLanguage: (checked: boolean) => void;
  myLanguage: LANGUAGE;
  otherLanguage: LANGUAGE;
}

export const ChattingTopNav = ({
  otherName,
  isMyLanguage,
  onToggleLanguage,
  myLanguage,
  otherLanguage,
}: ChattingTopNavProps) => (
  <CustomTopHeader className="flex items-center justify-between gap-8">
    <div className="flex items-center gap-8">
      <CustomIconButton asChild variant="ghost">
        <Link href={ROUTES.HOME.pathname}>
          <RiArrowGoBackFill className="size-6 text-slate-900" />
        </Link>
      </CustomIconButton>
      <h1 className="text-lg font-semibold">{otherName}</h1>
    </div>
    <div className="gap-2 flex-center">
      <span className="text-2xl">
        {LANGUAGE_FLAG[isMyLanguage ? myLanguage : otherLanguage]}
      </span>
      <Switch
        checked={isMyLanguage}
        size="3"
        onCheckedChange={onToggleLanguage}
      />
    </div>
  </CustomTopHeader>
);
