import Image from 'next/image';

import { KakaoLoginButton } from './_components/KakaoLoginButton';

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <KakaoLoginButton />
  </main>
);

export default Home;
