import type { PublicUser } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: PublicUser;
      requestId: string;
    }
  }
}
