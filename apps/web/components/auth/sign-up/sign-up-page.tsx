"use client";

import { AuthShell } from "@/components/auth/shared";
import { SignUpForm } from "@/components/auth/sign-up/sign-up-form";
import { AUTH_VISUALS } from "@/lib/auth";

function SignUpPage() {
  return <AuthShell form={<SignUpForm />} visual={AUTH_VISUALS.signUp} />;
}

export { SignUpPage };
