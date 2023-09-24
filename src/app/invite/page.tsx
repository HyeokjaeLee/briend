'use client';

import Image from 'next/image';

import TurtleStar from '@assets/resources/turtle-star.png';

import { InviteForm } from './components/InviteForm';

const InvitePage = () => (
  <article className="flex flex-col items-center max-w-3xl justify-center mx-auto my-16 p-4">
    <h1 className="font-bold text-3xl text-left w-full mb-12">
      <Image
        src={TurtleStar}
        alt="invite-new-friend"
        className="h-12 w-12 inline-block mr-2 animate-bounce"
      />{' '}
      새로운 친구 초대
    </h1>
    <InviteForm />
  </article>
);

export default InvitePage;
