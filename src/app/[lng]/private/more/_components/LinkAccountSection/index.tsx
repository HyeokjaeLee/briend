'use client';

import { LOGIN_PROVIDERS } from '@/constants';

import { LinkAccountButton } from './_components/LinkAccountButton';

export const LinkAccountSection = () => {
  return (
    <section>
      {Object.values(LOGIN_PROVIDERS).map((provider) => (
        <LinkAccountButton key={provider} />
      ))}
    </section>
  );
};
