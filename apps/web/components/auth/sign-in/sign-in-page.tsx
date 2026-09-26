"use client";

import { Suspense } from "react";
import { AuthShell } from "@/components/auth/shared";
import { SignInForm } from "@/components/auth/sign-in/sign-in-form";
import { AUTH_VISUALS } from "@/lib/auth";

function SignInPage() {
  return (
    <AuthShell
      form={
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      }
      visual={AUTH_VISUALS.signIn}
    />
  );
}

export { SignInPage };
