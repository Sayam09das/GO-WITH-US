import { Router } from "express";
import { documentsController } from "./documents.controller.js";

const documentsRouter = Router();

documentsRouter.get("/", documentsController.listDocuments);
documentsRouter.post("/", documentsController.uploadDocument);
documentsRouter.delete("/:documentId", documentsController.deleteDocument);

export { documentsRouter };
