'use client';

import { useParams } from 'next/navigation';

export default function Chatting() {
  const params = useParams();

  console.log(params);

  return <div className="2xl:block">Chatting</div>;
}
