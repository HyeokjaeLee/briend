import { FriendList } from './_components/FriendList';
import { HomeHeader } from './_components/HomeHeader';

export default async function HomePage() {
  return (
    <article className="flex min-h-full flex-col">
      <HomeHeader />
      <FriendList />
    </article>
  );
}
