import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  createItineraryItemSchema,
  createTripDaySchema,
  createTripSchema,
  listTripsQuerySchema,
  moveItineraryItemSchema,
  reorderItineraryItemsSchema,
  tripDayItemParamSchema,
  tripDayParamSchema,
  tripIdParamSchema,
  tripItemMoveParamSchema,
  updateItineraryItemSchema,
  updateTripDaySchema,
  updateTripSchema,
} from "./trips.schemas.js";
import { tripsService } from "./trips.service.js";

export const tripsController = {
  async listTrips(req: Request, res: Response) {
    try {
      const query = listTripsQuerySchema.parse(req.query);
      const items = await tripsService.listTrips(getAuthUserId(req), query.status);
      sendData(res, 200, { items });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async createTrip(req: Request, res: Response) {
    try {
      const body = createTripSchema.parse(req.body);
      const trip = await tripsService.createTrip(getAuthUserId(req), body);
      sendData(res, 201, { trip });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getTrip(req: Request, res: Response) {
    try {
      const params = tripIdParamSchema.parse(req.params);
      const trip = await tripsService.getTrip(getAuthUserId(req), params.tripId);
      sendData(res, 200, { trip });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async updateTrip(req: Request, res: Response) {
    try {
      const params = tripIdParamSchema.parse(req.params);
      const body = updateTripSchema.parse(req.body);
      const trip = await tripsService.updateTrip(getAuthUserId(req), params.tripId, body);
      sendData(res, 200, { trip });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async deleteTrip(req: Request, res: Response) {
    try {
      const params = tripIdParamSchema.parse(req.params);
      await tripsService.deleteTrip(getAuthUserId(req), params.tripId);
      res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listDays(req: Request, res: Response) {
    try {
      const params = tripIdParamSchema.parse(req.params);
      const days = await tripsService.listDays(getAuthUserId(req), params.tripId);
      sendData(res, 200, { days });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async createDay(req: Request, res: Response) {
    try {
      const params = tripIdParamSchema.parse(req.params);
      const body = createTripDaySchema.parse(req.body ?? {});
      const day = await tripsService.createDay(getAuthUserId(req), params.tripId, body.title);
      sendData(res, 201, { day });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async updateDay(req: Request, res: Response) {
    try {
      const params = tripDayParamSchema.parse(req.params);
      const body = updateTripDaySchema.parse(req.body);
      const day = await tripsService.updateDay(
        getAuthUserId(req),
        params.tripId,
        params.dayId,
        body,
      );
      sendData(res, 200, { day });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async addItem(req: Request, res: Response) {
    try {
      const params = tripDayParamSchema.parse(req.params);
      const body = createItineraryItemSchema.parse(req.body);
      const item = await tripsService.addItem(
        getAuthUserId(req),
        params.tripId,
        params.dayId,
        body,
      );
      sendData(res, 201, { item });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async updateItem(req: Request, res: Response) {
    try {
      const params = tripDayItemParamSchema.parse(req.params);
      const body = updateItineraryItemSchema.parse(req.body);
      const item = await tripsService.updateItem(
        getAuthUserId(req),
        params.tripId,
        params.dayId,
        params.itemId,
        body,
      );
      sendData(res, 200, { item });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async deleteItem(req: Request, res: Response) {
    try {
      const params = tripDayItemParamSchema.parse(req.params);
      await tripsService.deleteItem(getAuthUserId(req), params.tripId, params.dayId, params.itemId);
      res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async reorderItems(req: Request, res: Response) {
    try {
      const params = tripDayParamSchema.parse(req.params);
      const body = reorderItineraryItemsSchema.parse(req.body);
      const day = await tripsService.reorderItems(
        getAuthUserId(req),
        params.tripId,
        params.dayId,
        body.items,
      );
      sendData(res, 200, { day });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async moveItem(req: Request, res: Response) {
    try {
      const params = tripItemMoveParamSchema.parse(req.params);
      const body = moveItineraryItemSchema.parse(req.body);
      const item = await tripsService.moveItem(
        getAuthUserId(req),
        params.tripId,
        params.itemId,
        body,
      );
      sendData(res, 200, { item });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
