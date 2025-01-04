import { ChattingPageHeader } from './_components/ChattingPageHeader';
import { ChattingTemplate } from './_components/ChattingTemplate';

interface ChattingPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ChattingPage({ params }: ChattingPageProps) {
  const { userId } = await params;

  return (
    <>
      <ChattingPageHeader userId={userId} />
      <ChattingTemplate userId={userId} />
    </>
  );
}
