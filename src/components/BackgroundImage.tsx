import Image from 'next/image';

import TokyoPicture from '@assets/resources/tokyo-picture.jpeg';

export const BackgroundImage = () => (
  <Image
    src={TokyoPicture}
    alt="background"
    className="top-0 absolute z-[-1] object-cover h-full w-full filter: brightness-[0.15]"
    priority
  />
);
