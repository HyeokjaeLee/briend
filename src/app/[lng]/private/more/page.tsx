import { FaChevronRight } from 'react-icons/fa6';
import { RiLogoutCircleLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/server';
import { signOut } from '@/auth';
import { CustomButton } from '@/components/CustomButton';
import { CustomLink } from '@/components/CustomLink';
import type { LANGUAGE } from '@/constants/language';
import type { RouteObject } from '@/routes/client';
import { ROUTES } from '@/routes/client';

import { ProfileSection } from './_components/ProfileSection';

interface MorePageProps {
  params: {
    lng: LANGUAGE;
  };
}

interface MenuItem {
  title: string;
  route: RouteObject;
}

const MENU_ITEMS = [
  {
    title: 'edit-profile',
    route: ROUTES.EDIT_PROFILE,
  },
  {
    title: 'edit-invite-message',
    route: ROUTES.EDIT_INVITE_MESSAGE,
  },
] as const satisfies MenuItem[];

const MorePage = async ({ params: { lng } }: MorePageProps) => {
  const { t } = await useTranslation('more', lng);

  return (
    <article className="mx-4 mt-8 flex flex-col">
      <ProfileSection className="p-4" />
      <ul className="mt-8">
        {MENU_ITEMS.map(({ title, route }) => (
          <li key={title}>
            <CustomButton
              asChild
              className="flex items-center justify-between rounded-none text-slate-50"
              variant="ghost"
            >
              <CustomLink href={route.pathname}>
                {t(title)}
                <FaChevronRight className="size-5" />
              </CustomLink>
            </CustomButton>
          </li>
        ))}
        <li>
          <form
            action={async () => {
              'use server';

              await signOut({
                redirectTo: `/${lng}${ROUTES.CHATTING_LIST.pathname}`,
              });
            }}
          >
            <CustomButton
              className="flex w-full items-center justify-between rounded-none text-slate-50"
              variant="ghost"
            >
              {t('logout')}
              <RiLogoutCircleLine className="size-5" />
            </CustomButton>
          </form>
        </li>
      </ul>
    </article>
  );
};

export default MorePage;
