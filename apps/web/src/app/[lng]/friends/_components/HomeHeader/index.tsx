'use client';

import { useUserData } from '@/hooks';

import { GuestBanner } from './GuestBanner';
import { MyProfileCard, MyProfileCardSkeleton } from './MyProfileCard';

export const HomeHeader = () => {
  const { isLogin, isLoading, user } = useUserData();

  return (
    <header className="border-b border-b-slate-100">
      {isLogin ? (
        <MyProfileCard userName={user.name} />
      ) : isLoading ? (
        <MyProfileCardSkeleton />
      ) : (
        <GuestBanner />
      )}
    </header>
  );
};
