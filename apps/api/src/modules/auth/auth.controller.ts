import type { Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env.js";
import { clearSessionCookie, setSessionCookie } from "../../lib/cookies.js";
import { AppError, sendData, sendError } from "../../lib/errors.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  sessionIdSchema,
  verifyEmailSchema,
} from "./auth.schemas.js";
import {
  authService,
  getRequestMeta,
  readSessionToken,
  validateResetToken,
  validateVerificationToken,
} from "./auth.service.js";

export { requireAdmin, requireAuth };

function handleError(error: unknown, res: Response): void {
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.code, error.message);
    return;
  }

  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Invalid request.";
    sendError(res, 400, "VALIDATION_ERROR", message);
    return;
  }

  console.error(error);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong.");
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const body = registerSchema.parse(req.body);
      const result = await authService.register(body, getRequestMeta(req));
      sendData(res, 201, {
        user: result.user,
        message: "Check your inbox to verify your email before signing in.",
        maskedEmail: result.maskedEmail,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AuthValidationError") {
        handleError(new AppError(400, "VALIDATION_ERROR", error.message), res);
        return;
      }
      handleError(error, res);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const body = loginSchema.parse(req.body);
      const result = await authService.login(body, getRequestMeta(req));
      setSessionCookie(res, result.sessionToken, result.rememberMe);
      sendData(res, 200, { user: result.user });
    } catch (error) {
      handleError(error, res);
    }
  },

  async me(req: Request, res: Response) {
    try {
      const token = readSessionToken(req);
      const user = await authService.getMe(token ?? "");
      sendData(res, 200, { user });
    } catch (error) {
      handleError(error, res);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const token = readSessionToken(req);
      await authService.logout(token ?? "", getRequestMeta(req));
      clearSessionCookie(res);
      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  },

  async logoutAll(req: Request, res: Response) {
    try {
      const token = readSessionToken(req);
      await authService.logoutAll(token ?? "", getRequestMeta(req));
      clearSessionCookie(res);
      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  },

  async verifyEmailGet(req: Request, res: Response) {
    try {
      const token = typeof req.query.token === "string" ? req.query.token : "";
      verifyEmailSchema.parse({ token });
      await authService.verifyEmail(token, getRequestMeta(req));
      res.redirect(`${env.appUrl}/verify-email/success`);
    } catch {
      res.redirect(`${env.appUrl}/verify-email?error=invalid`);
    }
  },

  async verifyEmailPost(req: Request, res: Response) {
    try {
      const body = verifyEmailSchema.parse(req.body);
      const user = await authService.verifyEmail(body.token, getRequestMeta(req));
      sendData(res, 200, { user, message: "Email verified successfully." });
    } catch (error) {
      handleError(error, res);
    }
  },

  async resendVerification(req: Request, res: Response) {
    try {
      const body = resendVerificationSchema.parse(req.body);
      const result = await authService.resendVerification(body.email, getRequestMeta(req));
      sendData(res, 202, result);
    } catch (error) {
      handleError(error, res);
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const body = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(body.email, getRequestMeta(req));
      sendData(res, 202, result);
    } catch (error) {
      handleError(error, res);
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const body = resetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(body, getRequestMeta(req));
      sendData(res, 200, result);
    } catch (error) {
      if (error instanceof Error && error.name === "AuthValidationError") {
        handleError(new AppError(400, "VALIDATION_ERROR", error.message), res);
        return;
      }
      handleError(error, res);
    }
  },

  async changePassword(req: Request, res: Response) {
    try {
      const body = changePasswordSchema.parse(req.body);
      const token = readSessionToken(req);
      const result = await authService.changePassword(token ?? "", body, getRequestMeta(req));
      clearSessionCookie(res);
      sendData(res, 200, result);
    } catch (error) {
      if (error instanceof Error && error.name === "AuthValidationError") {
        handleError(new AppError(400, "VALIDATION_ERROR", error.message), res);
        return;
      }
      handleError(error, res);
    }
  },

  async listSessions(req: Request, res: Response) {
    try {
      const token = readSessionToken(req);
      const sessions = await authService.listSessions(token ?? "");
      sendData(res, 200, { sessions });
    } catch (error) {
      handleError(error, res);
    }
  },

  async revokeSession(req: Request, res: Response) {
    try {
      const params = sessionIdSchema.parse(req.params);
      const token = readSessionToken(req);
      const result = await authService.revokeSession(token ?? "", params.id, getRequestMeta(req));

      if (result.revokedCurrentSession) {
        clearSessionCookie(res);
      }

      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  },

  async validateVerificationToken(req: Request, res: Response) {
    try {
      const token = typeof req.query.token === "string" ? req.query.token : "";
      const valid = token ? await validateVerificationToken(token) : false;
      sendData(res, 200, { valid });
    } catch (error) {
      handleError(error, res);
    }
  },

  async validateResetToken(req: Request, res: Response) {
    try {
      const token = typeof req.query.token === "string" ? req.query.token : "";
      const valid = token ? await validateResetToken(token) : false;
      sendData(res, 200, { valid });
    } catch (error) {
      handleError(error, res);
    }
  },
};
