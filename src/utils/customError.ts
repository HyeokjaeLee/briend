export interface CustomErrorProps {
  message?: string;
  status?: number;
  cause?: string;
}

export class CustomError extends Error {
  status: number;
  customStatus: number;

  constructor(props?: CustomErrorProps) {
    const customStatus = props?.status ?? 500;
    const httpsStatus = Number(String(customStatus).slice(0, 3));

    const message = `<${customStatus}> ${props?.message ?? 'Unknown Error'}`;

    super(message);
    this.status = httpsStatus;
    this.customStatus = customStatus;
    this.cause = props?.cause;
  }
}

export enum ERROR_STATUS {
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  EXPIRED_CHAT = 4011,
  UNKNOWN_VALUE = 422,
}

export const ERROR = {
  NOT_ENOUGH_PARAMS: (requiredParams: string[]) => ({
    message: `${requiredParams.join(', ')} is required`,
    status: 400,
  }),
  UNAUTHORIZED: (message = 'Unauthorized') => ({
    message,
    status: ERROR_STATUS.UNAUTHORIZED,
  }),
  EXPIRED_CHAT: (message = 'Expired Chat') => ({
    message,
    status: ERROR_STATUS.EXPIRED_CHAT,
  }),
  UNKNOWN_VALUE: (key: string = 'value') => ({
    message: `${key} is unknown`,
    status: ERROR_STATUS.UNKNOWN_VALUE,
  }),
};
