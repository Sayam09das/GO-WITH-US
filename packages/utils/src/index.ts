import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export {
  escapeHtmlForEmail,
  type RenderedTransactionalEmail,
  renderTransactionalEmail,
  type TransactionalEmailContent,
  type TransactionalEmailCta,
} from "./email/transactional.js";

/** Join class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
