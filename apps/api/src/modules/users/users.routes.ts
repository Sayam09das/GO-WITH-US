import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { usersController } from "./users.controller.js";

const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get("/me", usersController.getMe);
usersRouter.patch("/me", usersController.patchMe);
usersRouter.patch("/me/avatar", usersController.patchAvatar);

usersRouter.get("/me/saved-destinations", usersController.listSavedDestinations);
usersRouter.post("/me/saved-destinations/:destinationId", usersController.saveDestination);
usersRouter.delete("/me/saved-destinations/:destinationId", usersController.unsaveDestination);

usersRouter.get("/me/saved-stays", usersController.listSavedStays);
usersRouter.post("/me/saved-stays/:stayId", usersController.saveStay);
usersRouter.delete("/me/saved-stays/:stayId", usersController.unsaveStay);

usersRouter.get("/me/saved-experiences", usersController.listSavedExperiences);
usersRouter.post("/me/saved-experiences/:experienceId", usersController.saveExperience);
usersRouter.delete("/me/saved-experiences/:experienceId", usersController.unsaveExperience);

usersRouter.get("/me/saved-restaurants", usersController.listSavedRestaurants);
usersRouter.post("/me/saved-restaurants/:restaurantId", usersController.saveRestaurant);
usersRouter.delete("/me/saved-restaurants/:restaurantId", usersController.unsaveRestaurant);

usersRouter.get("/me/activity", usersController.listActivity);

export { usersRouter };
