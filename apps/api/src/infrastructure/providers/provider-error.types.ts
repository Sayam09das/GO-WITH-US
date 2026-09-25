export type ProviderErrorCode =
  | "TIMEOUT"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "UNAVAILABLE"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR";

export type ClassifiedProviderError = {
  code: ProviderErrorCode;
  message: string;
  retryable: boolean;
  httpStatus?: number;
};
