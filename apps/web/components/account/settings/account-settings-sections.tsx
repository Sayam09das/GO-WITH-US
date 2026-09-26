import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AccountSettingsRowProps {
  label: string;
  description: string;
  href?: string;
  actionLabel?: string;
}

function AccountSettingsRow({
  label,
  description,
  href,
  actionLabel = "Manage",
}: AccountSettingsRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-xl">
        <p className="font-medium text-heading">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {href ? (
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="shrink-0" disabled>
          Coming soon
        </Button>
      )}
    </div>
  );
}

interface AccountSettingsGroupProps {
  title: string;
  children: ReactNode;
}

function AccountSettingsGroup({ title, children }: AccountSettingsGroupProps) {
  return (
    <section className="rounded-[1.25rem] border border-border/60 bg-background px-5 shadow-sm sm:px-6">
      <h2 className="border-b border-border/60 py-4 text-sm font-semibold text-heading">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function AccountSettingsSections() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <AccountSettingsGroup title="Account">
        <AccountSettingsRow
          label="Profile details"
          description="Update your name, bio, and where you call home."
          href="/account/profile"
          actionLabel="Edit profile"
        />
        <AccountSettingsRow
          label="Email & password"
          description="Sign-in credentials and security preferences."
          href="/sign-in"
          actionLabel="Sign in"
        />
      </AccountSettingsGroup>

      <AccountSettingsGroup title="Notifications">
        <AccountSettingsRow
          label="Trip reminders"
          description="Gentle nudges before departures and itinerary changes."
        />
        <AccountSettingsRow
          label="Saved place updates"
          description="When a saved stay or experience has new details."
        />
      </AccountSettingsGroup>

      <AccountSettingsGroup title="Privacy">
        <AccountSettingsRow
          label="Data & visibility"
          description="Control what appears on your account overview."
        />
        <AccountSettingsRow
          label="Download your data"
          description="Export trips, saves, and activity when you need a copy."
        />
      </AccountSettingsGroup>
    </div>
  );
}

export { AccountSettingsSections };
