import { InviteChatQRTemplate } from './_components/InviteChatQRTemplate';

interface InviteChatQRPageProps {
  params: Promise<{
    inviteToken: string;
  }>;
}

const InviteChatQRPage = async (props: InviteChatQRPageProps) => {
  const { inviteToken } = await props.params;

  return <InviteChatQRTemplate inviteToken={inviteToken} />;
};

export default InviteChatQRPage;
