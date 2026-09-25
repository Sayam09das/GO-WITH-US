import { Router } from "express";
import { optionalAuth } from "../../middleware/auth.js";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import { handleGlobalSearch, searchController } from "./search.controller.js";

const searchRouter = Router();

searchRouter.use(optionalAuth);
searchRouter.use(catalogRateLimit);

searchRouter.get("/", searchRateLimit, (req, res) => {
  void searchController.searchByQuery(req, res);
});

searchRouter.all("/", searchRateLimit, handleGlobalSearch);

export { searchRouter };
