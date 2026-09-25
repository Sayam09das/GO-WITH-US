import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { pingRedis } from "./infrastructure/redis/redis.js";
import { prisma } from "./lib/db.js";
import { errorHandler } from "./middleware/error-handler.js";
import { validateOrigin } from "./middleware/origin-guard.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { requestLoggerMiddleware } from "./middleware/request-logger.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { bookingsRouter } from "./modules/bookings/bookings.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { destinationsRouter } from "./modules/destinations/destinations.routes.js";
import { discoveryRouter } from "./modules/discovery/discovery.routes.js";
import { experiencesRouter } from "./modules/experiences/experiences.routes.js";
import { paymentsRouter } from "./modules/payments/payments.routes.js";
import { restaurantsRouter } from "./modules/restaurants/restaurants.routes.js";
import { reviewsRouter } from "./modules/reviews/reviews.routes.js";
import { staysRouter } from "./modules/stays/stays.routes.js";
import { storiesRouter } from "./modules/stories/stories.routes.js";
import { tripsRouter } from "./modules/trips/trips.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";

async function healthReadyHandler(req: Request, res: Response): Promise<void> {
  let database: "up" | "down" = "down";
  let redis: "up" | "down" | "not_configured" = env.redisUrl ? "down" : "not_configured";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch {
    database = "down";
  }

  if (env.redisUrl) {
    redis = (await pingRedis()) ? "up" : "down";
  }

  const ready =
    database === "up" && (redis === "up" || redis === "down" || redis === "not_configured");

  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    service: "gowithus-api",
    database,
    redis,
    requestId: req.requestId,
  });
}

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

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
      methods: ["GET", "POST", "PATCH", "DELETE", "QUERY", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "x-request-id"],
      exposedHeaders: ["x-request-id"],
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

  app.get("/health/live", (_req, res) => {
    res.json({
      status: "alive",
      service: "gowithus-api",
    });
  });

  app.get("/health/ready", healthReadyHandler);
  app.get("/ready", healthReadyHandler);

  const apiRouter = express.Router();

  apiRouter.get("/", (_req, res) => {
    res.json({
      version: "v1",
      service: "gowithus-api",
    });
  });

  apiRouter.use("/auth", authRouter);
  apiRouter.use("/discovery", discoveryRouter);
  apiRouter.use("/destinations", destinationsRouter);
  apiRouter.use("/stays", staysRouter);
  apiRouter.use("/experiences", experiencesRouter);
  apiRouter.use("/restaurants", restaurantsRouter);
  apiRouter.use("/stories", storiesRouter);
  apiRouter.use("/reviews", reviewsRouter);
  apiRouter.use("/bookings", bookingsRouter);
  apiRouter.use("/payments", paymentsRouter);
  apiRouter.use("/users", usersRouter);
  apiRouter.use("/dashboard", dashboardRouter);
  apiRouter.use("/trips", tripsRouter);

  app.use("/api/v1", apiRouter);
  app.use(errorHandler);

  return app;
}
