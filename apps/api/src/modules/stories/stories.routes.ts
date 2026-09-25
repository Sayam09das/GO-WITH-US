import { Router } from "express";
import { handleStorySearch, storiesController } from "./stories.controller.js";

const storiesRouter = Router();

storiesRouter.get("/", storiesController.list);
storiesRouter.get("/featured", storiesController.featured);
storiesRouter.get("/categories", storiesController.categories);
storiesRouter.all("/search", handleStorySearch);
storiesRouter.get("/:slug", storiesController.getBySlug);

export { storiesRouter };
