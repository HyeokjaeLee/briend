import { FriendList } from './_components/FriendList';
import { HomeHeader } from './_components/HomeHeader';

export default function HomePage() {
  return (
    <article>
      <HomeHeader />
      <FriendList />
    </article>
  );
}
