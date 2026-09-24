import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { disconnectPrisma } from "./lib/db.js";

const app = createApp();
const server = app.listen(env.port, env.host, () => {
  console.log(`API server listening on http://${env.host}:${env.port}`);
  console.log(`Health check: http://localhost:${env.port}/health`);
  console.log(`Readiness check: http://localhost:${env.port}/ready`);
  console.log(`API base: http://localhost:${env.port}/api/v1`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
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
