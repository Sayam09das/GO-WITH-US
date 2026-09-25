import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { bookingRateLimit } from "../../middleware/rate-limit.js";
import { bookingsController } from "./bookings.controller.js";

const bookingsRouter = Router();

bookingsRouter.use(requireAuth);

bookingsRouter.post("/", bookingRateLimit, bookingsController.createBooking);
bookingsRouter.get("/", bookingsController.listBookings);
bookingsRouter.get("/:bookingId", bookingsController.getBooking);
bookingsRouter.post("/:bookingId/cancel", bookingsController.cancelBooking);

export { bookingsRouter };
