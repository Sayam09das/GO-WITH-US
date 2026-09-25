import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  destinationIdParamSchema,
  stayIdParamSchema,
  updateAvatarSchema,
  updateProfileSchema,
} from "./users.schemas.js";
import { usersService } from "./users.service.js";

export const usersController = {
  async getMe(req: Request, res: Response) {
    try {
      const profile = await usersService.getProfile(getAuthUserId(req));
      sendData(res, 200, { user: profile });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async patchMe(req: Request, res: Response) {
    try {
      const body = updateProfileSchema.parse(req.body);
      const profile = await usersService.updateProfile(getAuthUserId(req), body);
      sendData(res, 200, { user: profile });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async patchAvatar(req: Request, res: Response) {
    try {
      const body = updateAvatarSchema.parse(req.body);
      const profile = await usersService.updateAvatar(getAuthUserId(req), body.avatar);
      sendData(res, 200, { user: profile });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listSavedDestinations(req: Request, res: Response) {
    try {
      const savedDestinations = await usersService.listSavedDestinations(getAuthUserId(req));
      sendData(res, 200, { savedDestinations });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async saveDestination(req: Request, res: Response) {
    try {
      const params = destinationIdParamSchema.parse(req.params);
      const savedDestination = await usersService.saveDestination(
        getAuthUserId(req),
        params.destinationId,
      );
      sendData(res, 201, { savedDestination });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async unsaveDestination(req: Request, res: Response) {
    try {
      const params = destinationIdParamSchema.parse(req.params);
      await usersService.unsaveDestination(getAuthUserId(req), params.destinationId);
      res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listSavedStays(req: Request, res: Response) {
    try {
      const savedStays = await usersService.listSavedStays(getAuthUserId(req));
      sendData(res, 200, { savedStays });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async saveStay(req: Request, res: Response) {
    try {
      const params = stayIdParamSchema.parse(req.params);
      const savedStay = await usersService.saveStay(getAuthUserId(req), params.stayId);
      sendData(res, 201, { savedStay });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async unsaveStay(req: Request, res: Response) {
    try {
      const params = stayIdParamSchema.parse(req.params);
      await usersService.unsaveStay(getAuthUserId(req), params.stayId);
      res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listActivity(req: Request, res: Response) {
    try {
      const activity = await usersService.listActivity(getAuthUserId(req));
      sendData(res, 200, { activity });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
