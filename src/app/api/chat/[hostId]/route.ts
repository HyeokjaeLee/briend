import { NextRequest } from 'next/server';



export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      host: string;
    };
  },
) => {
  const { host } = params;
  const data = await req.json();

  const channel = host;
};
