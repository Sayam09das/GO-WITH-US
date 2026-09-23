"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";
import { AuthShell } from "@/components/auth/shared";
import { AUTH_VISUALS } from "@/lib/auth";

function ResetPasswordPage() {
  return <AuthShell form={<ResetPasswordForm />} visual={AUTH_VISUALS.resetPassword} />;
}

export { ResetPasswordPage };
