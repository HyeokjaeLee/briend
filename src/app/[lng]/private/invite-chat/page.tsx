import { nanoid } from 'nanoid';
import { random } from 'node-emoji';

import { QR } from '@/components/QR';
import { Select } from '@radix-ui/themes';

import { CreateQRSection } from './_components/CreateQRSection';

const CreateChatPage = () => {
  return (
    <article>
      <CreateQRSection />
    </article>
  );
};

export default CreateChatPage;
