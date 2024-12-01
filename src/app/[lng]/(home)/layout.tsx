'use client';

import { useSession } from 'next-auth/react';

interface HomeLayoutProps {
  children: React.ReactNode;
  friendList: React.ReactNode;
}

const HomeLayout = ({ children, friendList }: HomeLayoutProps) => {
  const session = useSession();

  const isLogin = !!session.data;

  return isLogin ? friendList : children;
};

export default HomeLayout;

export const dynamic = 'force-static';
