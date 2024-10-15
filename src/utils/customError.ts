interface CustomErrorProps {
  message?: string;
  status?: number;
  cause?: string;
}

export class CustomError extends Error {
  status: number;

  constructor(props?: CustomErrorProps) {
    super(props?.message);
    this.status = props?.status ?? 500;
    this.cause = props?.cause;
  }
}

export const ERROR = {
  NOT_ENOUGH_PARAMS: (requiredParams: string[]) =>
    new CustomError({
      message: `${requiredParams.join(', ')} is required`,
      status: 400,
    }),
  UNAUTHORIZED: (message = 'Unauthorized') =>
    new CustomError({
      message,
      status: 401,
    }),
  UNKNOWN_VALUE: (key: string = 'value') =>
    new CustomError({
      message: `${key} is unknown`,
      status: 422,
    }),
};
