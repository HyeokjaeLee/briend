import { CustomError } from '@/utils/customError';

interface ErrorToPageProps {
  searchParams: Promise<{
    status: string;
  }>;
}

const ErrorToPage = async ({ searchParams }: ErrorToPageProps) => {
  const status = (await searchParams).status;

  if (status) {
    throw new CustomError({
      status: Number(status),
    });
  }

  throw new CustomError({
    status: 500,
  });
};

export default ErrorToPage;
