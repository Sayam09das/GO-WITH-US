import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller.js";

const authRouter = Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many attempts. Please try again later.",
    },
  },
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${req.ip}:${String(req.body?.email ?? "").toLowerCase()}`,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many login attempts. Please try again later.",
    },
  },
});

authRouter.post("/register", authRateLimit, authController.register);
authRouter.post("/sign-up", authRateLimit, authController.register);

authRouter.post("/login", loginRateLimit, authController.login);
authRouter.post("/sign-in", loginRateLimit, authController.login);

authRouter.get("/me", authController.me);
authRouter.post("/logout", authController.logout);
authRouter.post("/sign-out", authController.logout);
authRouter.post("/logout-all", authController.logoutAll);

authRouter.get("/verify-email", authController.verifyEmailGet);
authRouter.post("/verify-email", authController.verifyEmailPost);
authRouter.get("/verify-email/validate", authController.validateVerificationToken);
authRouter.post("/resend-verification", authRateLimit, authController.resendVerification);

authRouter.post("/forgot-password", authRateLimit, authController.forgotPassword);
authRouter.post("/reset-password", authRateLimit, authController.resetPassword);
authRouter.get("/reset-password/validate", authController.validateResetToken);
authRouter.post("/change-password", authController.changePassword);

authRouter.get("/sessions", authController.listSessions);
authRouter.delete("/sessions/:id", authController.revokeSession);

export { authRouter };
