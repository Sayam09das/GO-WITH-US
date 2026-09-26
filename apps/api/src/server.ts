import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./infrastructure/logging/logger.js";
import { closeQueues } from "./infrastructure/queue/queues.js";
import { connectRedis, disconnectRedis } from "./infrastructure/redis/redis.js";
import { disconnectPrisma } from "./lib/db.js";

const app = createApp();

async function startServer(): Promise<void> {
  const server = app.listen(env.port, env.host, () => {
    logger.info("server.started", {
      host: env.host,
      port: env.port,
      healthLive: `http://localhost:${env.port}/health/live`,
      healthReady: `http://localhost:${env.port}/health/ready`,
      apiBase: `http://localhost:${env.port}/api/v1`,
    });
  });

  void connectRedis().then((connected) => {
    if (!connected) {
      logger.warn("redis.startup_skipped", {
        message: "API is running without Redis. Caching and queues are degraded.",
      });
    }
  });

  async function shutdown(signal: string) {
    logger.info("server.shutdown", { signal });

    server.close(async () => {
      await closeQueues();
      await disconnectRedis();
      await disconnectPrisma();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void startServer();
