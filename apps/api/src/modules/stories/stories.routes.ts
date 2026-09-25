import { Router } from "express";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import { handleStorySearch, storiesController } from "./stories.controller.js";

const storiesRouter = Router();

storiesRouter.use(catalogRateLimit);

storiesRouter.get("/", storiesController.list);
storiesRouter.get("/featured", storiesController.featured);
storiesRouter.get("/categories", storiesController.categories);
storiesRouter.all("/search", searchRateLimit, handleStorySearch);
storiesRouter.get("/:slug", storiesController.getBySlug);

export { storiesRouter };
