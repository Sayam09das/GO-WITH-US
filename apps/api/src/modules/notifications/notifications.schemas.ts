import { z } from "zod";

export const notificationIdParamSchema = z.object({
  notificationId: z.string().uuid(),
});
