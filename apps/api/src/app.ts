import cors from "cors";
import express, { type Express } from "express";
import { env } from "./config/env.js";

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: env.appOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "gowithus-api",
    });
  });

  const apiRouter = express.Router();

  apiRouter.get("/", (_req, res) => {
    res.json({
      version: "v1",
      service: "gowithus-api",
    });
  });

  app.use("/api/v1", apiRouter);

  return app;
}
