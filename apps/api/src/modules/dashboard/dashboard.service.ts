import { tripsService } from "../trips/trips.service.js";
import { usersService } from "../users/users.service.js";

export const dashboardService = {
  async getOverview(userId: string) {
    const [user, upcomingTrips, savedDestinations, savedStays, recentActivity] = await Promise.all([
      usersService.getProfile(userId),
      tripsService.listTrips(userId, "upcoming"),
      usersService.listSavedDestinations(userId),
      usersService.listSavedStays(userId),
      usersService.listActivity(userId),
    ]);

    return {
      user,
      upcomingTrips,
      savedDestinations,
      savedStays,
      recentStories: [],
      recentActivity,
    };
  },
};
