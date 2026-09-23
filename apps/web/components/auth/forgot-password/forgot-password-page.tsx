"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password/forgot-password-form";
import { AuthShell } from "@/components/auth/shared";
import { AUTH_VISUALS } from "@/lib/auth";

function ForgotPasswordPage() {
  return <AuthShell form={<ForgotPasswordForm />} visual={AUTH_VISUALS.forgotPassword} />;
}

export { ForgotPasswordPage };
