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
  NOT_ENOUGH_PARAMS: (requiredParams: string[]) => ({
    message: `${requiredParams.join(', ')} is required`,
    status: 400,
  }),
  UNAUTHORIZED: (message = 'Unauthorized') => ({
    message,
    status: 401,
  }),
  UNKNOWN_VALUE: (key: string = 'value') => ({
    message: `${key} is unknown`,
    status: 422,
  }),
};
