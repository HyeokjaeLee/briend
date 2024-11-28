import { ChattingRoomTemplate } from './_components/ChattingRoomTemplate';

interface ChattingPageProps {
  params: Promise<{
    channelId: string;
  }>;
}

const ChattingPage = async (props: ChattingPageProps) => {
  const { channelId } = await props.params;

  return <ChattingRoomTemplate channelId={channelId} />;
};

export default ChattingPage;
