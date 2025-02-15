import { IS_CLIENT } from '@/constants';

export enum ERROR_CODE {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  INTERNAL_CLIENT_ERROR = 5001,
  INTERNAL_FIRESTORE_ERROR = 5003,
  INTERNAL_REALTIME_DATABASE_ERROR = 5004,
  PARSE_ERROR = 5002,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  UNAUTHORIZED = 401,
  EXPIRED_CHAT = 4011,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_SUPPORTED = 405,
  TIMEOUT = 408,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNPROCESSABLE_CONTENT = 422,
  UNKNOWN_VALUE = 4221,
  TOO_MANY_REQUESTS = 429,
  CLIENT_CLOSED_REQUEST = 499,
}

export interface CustomErrorProps {
  code?: keyof typeof ERROR_CODE;
  message?: string;
  cause?: string | unknown;
}

export class CustomError extends Error {
  public readonly status: number;
  public readonly customStatus: number;
  public readonly code: keyof typeof ERROR_CODE;

  constructor(_props?: CustomErrorProps | string) {
    const props = typeof _props === 'string' ? { message: _props } : _props;

    const defaultKey = IS_CLIENT
      ? 'INTERNAL_CLIENT_ERROR'
      : 'INTERNAL_SERVER_ERROR';
    const code = props?.code ? props.code : defaultKey;

    const customStatus = ERROR_CODE[code];
    const httpsStatus = Number(String(customStatus).slice(0, 3));

    const defaultMessage = Object.entries(ERROR_CODE).find(
      ([, value]) => value === customStatus,
    );

    const message = `<${customStatus}> ${props?.message ?? defaultMessage?.[0] ?? defaultKey}`;

    super(message);

    this.status = httpsStatus;
    this.customStatus = customStatus;
    this.cause = props?.cause;
    this.code = code;
  }
}
