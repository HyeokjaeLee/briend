import { InviteChatTemplate } from './_components/InviteChatTemplate';

interface InviteChatQRPageProps {
  params: Promise<{
    inviteToken: string;
  }>;
}

const InviteChatQRPage = async (props: InviteChatQRPageProps) => {
  const { inviteToken } = await props.params;

  return <InviteChatTemplate inviteToken={inviteToken} />;
};

export default InviteChatQRPage;
