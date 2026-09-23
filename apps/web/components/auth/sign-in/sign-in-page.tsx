"use client";

import { AuthShell } from "@/components/auth/shared";
import { SignInForm } from "@/components/auth/sign-in/sign-in-form";
import { AUTH_VISUALS } from "@/lib/auth";

function SignInPage() {
  return <AuthShell form={<SignInForm />} visual={AUTH_VISUALS.signIn} />;
}

export { SignInPage };
