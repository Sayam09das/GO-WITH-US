import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../infrastructure/logging/logger.js";

const transporter =
  env.smtpHost.length > 0
    ? nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpPort === 465,
        auth:
          env.smtpUser && env.smtpPass
            ? {
                user: env.smtpUser,
                pass: env.smtpPass,
              }
            : undefined,
      })
    : null;

export async function sendVerificationEmail(input: {
  email: string;
  fullName: string;
  token: string;
}): Promise<void> {
  const verifyUrl = `${env.apiUrl}/api/v1/auth/verify-email?token=${encodeURIComponent(input.token)}`;
  await deliverEmail({
    to: input.email,
    subject: "Verify your GO WITH US account",
    text: `Hi ${input.fullName},\n\nVerify your account:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    html: `<p>Hi ${input.fullName},</p><p><a href="${verifyUrl}">Verify my email</a></p>`,
    devLabel: "verification",
    devUrl: verifyUrl,
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  fullName: string;
  token: string;
}): Promise<void> {
  const resetUrl = `${env.appUrl}/reset-password?token=${encodeURIComponent(input.token)}`;
  await deliverEmail({
    to: input.email,
    subject: "Reset your GO WITH US password",
    text: `Hi ${input.fullName},\n\nReset your password:\n${resetUrl}`,
    html: `<p>Hi ${input.fullName},</p><p><a href="${resetUrl}">Reset password</a></p>`,
    devLabel: "password reset",
    devUrl: resetUrl,
  });
}

export async function sendBookingConfirmationEmail(input: {
  email: string;
  fullName: string;
  bookingReference: string;
}): Promise<void> {
  const bookingsUrl = `${env.appUrl}/account/bookings`;
  await deliverEmail({
    to: input.email,
    subject: `Booking received — ${input.bookingReference}`,
    text: `Hi ${input.fullName},\n\nWe received your booking (${input.bookingReference}).\nView details: ${bookingsUrl}`,
    html: `<p>Hi ${input.fullName},</p><p>We received booking <strong>${input.bookingReference}</strong>.</p>`,
    devLabel: "booking confirmation",
    devUrl: bookingsUrl,
  });
}

async function deliverEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  devLabel: string;
  devUrl: string;
}): Promise<void> {
  if (!transporter) {
    logger.info("mail.dev_fallback", { label: input.devLabel, to: input.to, url: input.devUrl });
    return;
  }

  await transporter.sendMail({
    from: env.mailFrom,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  logger.info("mail.sent", { to: input.to, subject: input.subject });
}
