interface CustomErrorProps {
  message?: string;
  status?: number;
  cause?: string;
}

export class CustomError extends Error {
  status: number;

  constructor(props?: CustomErrorProps) {
    const status = props?.status ?? 500;
    const message = `<${status}> ${props?.message ?? 'Unknown Error'}`;

    super(message);
    this.status = status;
    this.cause = props?.cause;
  }
}

export enum ERROR_STATUS {
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  EXPIRED_CHAT = 403,
  UNKNOWN_VALUE = 422,
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
  EXPIRED_CHAT: (message = 'Expired Chat') => ({
    message,
    status: 403,
  }),
  UNKNOWN_VALUE: (key: string = 'value') => ({
    message: `${key} is unknown`,
    status: 422,
  }),
};
