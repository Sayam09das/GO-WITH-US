import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { assertUploadedFile, uploadSingle } from "../../lib/upload.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  documentIdParamSchema,
  travelDocumentCategorySchema,
  uploadTravelDocumentFieldsSchema,
} from "./documents.schemas.js";
import { documentsService } from "./documents.service.js";

export const documentsController = {
  async listDocuments(req: Request, res: Response) {
    try {
      const items = await documentsService.listDocuments(getAuthUserId(req));
      sendData(res, 200, { items });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  uploadDocument(req: Request, res: Response) {
    uploadSingle(req, res, async (error) => {
      if (error) {
        handleControllerError(error, res);
        return;
      }

      try {
        const file = assertUploadedFile(req.file);
        const fields = uploadTravelDocumentFieldsSchema.parse(req.body);
        const category = fields.category
          ? travelDocumentCategorySchema.parse(fields.category)
          : undefined;

        const document = await documentsService.uploadDocument(getAuthUserId(req), {
          file,
          name: fields.name,
          category,
          tripId: fields.tripId,
        });

        sendData(res, 201, { document });
      } catch (cause) {
        handleControllerError(cause, res);
      }
    });
  },

  async deleteDocument(req: Request, res: Response) {
    try {
      const params = documentIdParamSchema.parse(req.params);
      await documentsService.deleteDocument(getAuthUserId(req), params.documentId);
      res.status(204).end();
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
