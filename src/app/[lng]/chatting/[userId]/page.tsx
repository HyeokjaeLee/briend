import { ChattingTemplate } from './_components/ChattingTemplate/inadex';

interface ChattingPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ChattingPage = async ({ params }: ChattingPageProps) => {
  const { userId } = await params;

  return <ChattingTemplate userId={userId} />;
};

export default ChattingPage;
