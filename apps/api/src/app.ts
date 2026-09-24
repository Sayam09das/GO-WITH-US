import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { prisma } from "./lib/db.js";
import { errorHandler } from "./middleware/error-handler.js";
import { validateOrigin } from "./middleware/origin-guard.js";
import { authRouter } from "./modules/auth/auth.routes.js";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.use(
    cors({
      origin: env.appOrigin,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser(env.sessionSecret));
  app.use(validateOrigin);

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "gowithus-api",
    });
  });

  app.get("/ready", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: "ready",
        service: "gowithus-api",
        database: "connected",
      });
    } catch (error) {
      res.status(503).json({
        status: "not_ready",
        service: "gowithus-api",
        database: "disconnected",
        message: error instanceof Error ? error.message : "Database unavailable",
      });
    }
  });

  const apiRouter = express.Router();

  apiRouter.get("/", (_req, res) => {
    res.json({
      version: "v1",
      service: "gowithus-api",
    });
  });

  apiRouter.use("/auth", authRouter);

  app.use("/api/v1", apiRouter);
  app.use(errorHandler);

  return app;
}
