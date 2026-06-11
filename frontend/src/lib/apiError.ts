export class ApiError extends Error {
  readonly status: number;
  readonly title: string | undefined;

  constructor(message: string, status = 0, title?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.title = title;
  }

  get isUnavailable(): boolean {
    return this.status === 0 || this.status === 503;
  }
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
