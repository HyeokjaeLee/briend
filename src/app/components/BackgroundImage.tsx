import Image from 'next/image';

import TokyoPicture from '@assets/resources/tokyo-picture.jpeg';

export const BackgroundImage = () => (
  <div className="absolute z-[-1] h-page w-full">
    <Image src={TokyoPicture} alt="tokyo" layout="fill" objectFit="cover" />
    <div className="w-full h-full bg-black opacity-80 absolute" />
  </div>
);
