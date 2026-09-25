import { AppError } from "./errors.js";

export class ProviderUnavailableError extends AppError {
  constructor(message = "Travel data is temporarily unavailable.") {
    super(503, "PROVIDER_UNAVAILABLE", message);
    this.name = "ProviderUnavailableError";
  }
}
