import { FaChevronRight } from 'react-icons/fa6';

import { getTranslation } from '@/app/i18n/server';
import { signIn, signOut } from '@/auth';
import { CustomButton, CustomLink } from '@/components';
import { COOKIES, LOGIN_PROVIDERS, type LANGUAGE } from '@/constants';
import type { RouteObject } from '@/routes/client';
import { ROUTES } from '@/routes/client';
import { assertEnum, customCookies, CustomError } from '@/utils';

import { LinkAccountButton } from './_components/LinkAccountButton';
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

const LINK_ACCOUNT_BUTTON_NAME = 'link-provider';

const MorePage = async (props: MorePageProps) => {
  const params = await props.params;

  const { lng } = params;

  const { t } = await getTranslation('more', lng);

  const handleLinkAccount = async (event: FormData) => {
    'use server';

    const value = event.get(LINK_ACCOUNT_BUTTON_NAME);

    if (typeof value !== 'string') throw new CustomError();

    const [provider, isLinkedString] = value.split('-');

    assertEnum(LOGIN_PROVIDERS, provider);

    const isLinked = isLinkedString === 'true';

    if (isLinked) {
      return;
    }

    const severCookies = await customCookies.server();

    severCookies.set(COOKIES.PROVIDER_TO_CONNECT, provider);

    await signIn(provider);
  };

  return (
    <article className="mx-4 mt-8 flex flex-col">
      <ProfileSection className="p-4" />
      <form action={handleLinkAccount} className="gap-4 flex-center">
        {Object.values(LOGIN_PROVIDERS).map((provider) => (
          <LinkAccountButton
            key={provider}
            name={LINK_ACCOUNT_BUTTON_NAME}
            provider={provider}
          />
        ))}
      </form>
      <ul className="mt-8">
        {MENU_ITEMS.map(({ title, route }) => (
          <li key={title} className="p-5">
            <CustomButton
              asChild
              className="flex items-center justify-between text-slate-900"
              variant="ghost"
            >
              <CustomLink href={route.pathname}>
                {t(title)}
                <FaChevronRight className="size-5" />
              </CustomLink>
            </CustomButton>
          </li>
        ))}
        <li className="p-5">
          <form
            action={async () => {
              'use server';

              await signOut();
            }}
          >
            <LogoutButton lng={lng} />
          </form>
        </li>
      </ul>
    </article>
  );
};

export default MorePage;
