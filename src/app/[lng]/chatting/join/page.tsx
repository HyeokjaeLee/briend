import { LoadingTemplate } from '@/components';

import { JoinTemplate } from './_components/JoinTemplate';

interface ChattingJoinPageProps {
  searchParams: Promise<{
    inviteToken: string;
  }>;
}

export default async function ChattingJoinPage({
  searchParams,
}: ChattingJoinPageProps) {
  const { inviteToken } = await searchParams;

  return (
    <>
      <JoinTemplate inviteToken={inviteToken} />
      <LoadingTemplate />
    </>
  );
}
