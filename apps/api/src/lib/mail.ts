import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../infrastructure/logging/logger.js";
import { renderTransactionalEmail } from "./email-templates.js";

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

function emailSiteContext() {
  return {
    siteUrl: env.appUrl,
    supportEmail: "hello@gowithus.com",
  };
}

export async function sendVerificationEmail(input: {
  email: string;
  fullName: string;
  token: string;
}): Promise<void> {
  const verifyUrl = `${env.apiUrl}/api/v1/auth/verify-email?token=${encodeURIComponent(input.token)}`;
  const { html, text } = renderTransactionalEmail({
    ...emailSiteContext(),
    preheader: "Confirm your email to start planning with GO WITH US.",
    headline: "Verify your email address",
    greetingName: input.fullName,
    paragraphs: [
      "Thanks for joining GO WITH US. Confirm your email to save places, build trips, and access your account.",
    ],
    cta: { label: "Verify email address", href: verifyUrl },
    footnote:
      "This link expires in 24 hours. If you did not create an account, you can safely ignore this email.",
  });

  await deliverEmail({
    to: input.email,
    subject: "Verify your GO WITH US account",
    text,
    html,
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
  const { html, text } = renderTransactionalEmail({
    ...emailSiteContext(),
    preheader: "Reset your GO WITH US password securely.",
    headline: "Reset your password",
    greetingName: input.fullName,
    paragraphs: [
      "We received a request to reset the password for your account. Choose a new password using the button below.",
      "If you did not request this change, no action is needed. Your password will stay the same.",
    ],
    cta: { label: "Reset password", href: resetUrl },
    footnote: "This link expires in 1 hour for your security.",
  });

  await deliverEmail({
    to: input.email,
    subject: "Reset your GO WITH US password",
    text,
    html,
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
  const { html, text } = renderTransactionalEmail({
    ...emailSiteContext(),
    preheader: `Your booking ${input.bookingReference} is on file with GO WITH US.`,
    headline: "We received your booking request",
    greetingName: input.fullName,
    paragraphs: [
      "Thank you for planning with GO WITH US. We have your booking details on file and will follow up if anything else is needed.",
    ],
    highlight: input.bookingReference,
    cta: { label: "View booking details", href: bookingsUrl },
    footnote: "This is a confirmation of receipt, not a payment receipt.",
  });

  await deliverEmail({
    to: input.email,
    subject: `Booking received — ${input.bookingReference}`,
    text,
    html,
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
    logger.info("mail.dev_fallback", {
      label: input.devLabel,
      to: input.to,
      url: input.devUrl,
    });
    return;
  }

  try {
    await transporter.sendMail({
      from: env.mailFrom,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    logger.info("mail.sent", {
      to: input.to,
      subject: input.subject,
    });
  } catch (error) {
    logger.error("mail.failed", {
      to: input.to,
      subject: input.subject,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
