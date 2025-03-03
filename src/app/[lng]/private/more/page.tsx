import { FaChevronRight } from 'react-icons/fa6';

import { Button, CustomLink } from '@/components';
import { getTranslation } from '@/configs/i18n/server';
import type { LANGUAGE } from '@/constants';
import type { RouteObject } from '@/routes/client';
import { ROUTES } from '@/routes/client';

import { LinkAccountSection } from './_components/LinkAccountSection';
import { LogoutButton } from './_components/LogoutButton';
import { ProfileSection } from './_components/ProfileSection';

interface MorePageProps {
  params: Promise<{
    lng: LANGUAGE;
  }>;
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
] as const satisfies MenuItem[];

const MorePage = async (props: MorePageProps) => {
  const params = await props.params;

  const { lng } = params;

  const { t } = await getTranslation('more', lng);

  return (
    <article className="mt-8 flex flex-col">
      <ProfileSection className="p-4" />
      <LinkAccountSection />
      <ul className="mt-8 flex flex-col gap-2">
        {MENU_ITEMS.map(({ title, route }) => (
          <li key={title}>
            <Button
              shape="square"
              size="17"
              asChild
              className="flex items-center justify-between px-8 text-slate-900"
              variant="ghost"
            >
              <CustomLink href={route.pathname}>
                {t(title)}
                <FaChevronRight className="size-5" />
              </CustomLink>
            </Button>
          </li>
        ))}
        <li>
          <LogoutButton logoutToastMessage={t('logout-toast-message')}>
            {t('logout')}
          </LogoutButton>
        </li>
      </ul>
    </article>
  );
};

export default MorePage;
