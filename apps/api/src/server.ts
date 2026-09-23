import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, env.host, () => {
  console.log(`API server listening on http://${env.host}:${env.port}`);
  console.log(`Health check: http://localhost:${env.port}/health`);
  console.log(`API base: http://localhost:${env.port}/api/v1`);
});
