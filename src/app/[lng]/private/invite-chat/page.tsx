import { InviteForm } from './_components/InviteForm';

const CreateChatPage = async () => {
  return (
    <article className="flex flex-1 flex-col items-center justify-between p-4">
      <InviteForm />
    </article>
  );
};

export default CreateChatPage;

export const dynamic = 'force-static';
