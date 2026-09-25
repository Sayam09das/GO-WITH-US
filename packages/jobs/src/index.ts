export const QUEUE_NAMES = {
  email: "email",
  booking: "booking",
  cleanup: "cleanup",
  notification: "notification",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export type VerificationEmailJob = {
  type: "verification";
  email: string;
  fullName: string;
  token: string;
};

export type PasswordResetEmailJob = {
  type: "password-reset";
  email: string;
  fullName: string;
  token: string;
};

export type BookingConfirmationEmailJob = {
  type: "booking-confirmation";
  email: string;
  fullName: string;
  bookingReference: string;
  bookingId: string;
};

export type EmailJobPayload =
  | VerificationEmailJob
  | PasswordResetEmailJob
  | BookingConfirmationEmailJob;

export type BookingPostCreateJob = {
  type: "post-create";
  userId: string;
  bookingId: string;
  bookingReference: string;
};

export type ReviewModerationJob = {
  type: "moderate-review";
  reviewId: string;
};

export type CacheWarmJob = {
  type: "warm-cache";
  target: "homepage" | "featured";
};

export type ExpiredBookingCleanupJob = {
  type: "cleanup-expired-bookings";
};

export type DestinationSyncJob = {
  type: "sync-destination";
  provider: string;
  providerPlaceId: string;
};

export type BookingJobPayload =
  | BookingPostCreateJob
  | ReviewModerationJob
  | CacheWarmJob
  | ExpiredBookingCleanupJob;

export type NotificationJobPayload = {
  type: "create-notification";
  userId: string;
  title: string;
  body: string;
  notificationType: "system" | "trip_reminder" | "itinerary_alert";
  metadata?: Record<string, string>;
};

export type CleanupJobPayload = ExpiredBookingCleanupJob | DestinationSyncJob;
