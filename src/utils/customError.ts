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
