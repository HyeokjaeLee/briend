interface CustomErrorProps {
  message?: string;
  status?: number;
  cause?: string;
}

export class CustomError extends Error {
  status: number;

  constructor({ message, status, cause }: CustomErrorProps) {
    super(message);
    this.status = status ?? 500;
    this.cause = cause;
  }
}
