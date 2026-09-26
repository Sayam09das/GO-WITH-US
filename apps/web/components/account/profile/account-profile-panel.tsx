"use client";

import type { UserProfile } from "@gowithus/types";
import { LoaderCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { uploadUserAvatar } from "@/lib/api/users";

interface AccountProfilePanelProps {
  initialProfile: UserProfile;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]?.slice(0, 1).toUpperCase() ?? "?";
  }
  return `${parts[0]?.slice(0, 1) ?? ""}${parts[parts.length - 1]?.slice(0, 1) ?? ""}`.toUpperCase();
}

function AccountProfilePanel({ initialProfile }: AccountProfilePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const updated = await uploadUserAvatar(file);
      setProfile(updated);
    } catch {
      setError("Could not upload your photo. Check Supabase storage settings and try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-20 border border-border/70 sm:size-24">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} alt="" />
          ) : (
            <AvatarFallback className="text-lg font-semibold text-primary">
              {initialsFromName(profile.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload aria-hidden="true" className="size-4" />
                Upload photo
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or WebP · stored in your avatars bucket
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>

      <dl className="grid max-w-2xl gap-4 rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Name
          </dt>
          <dd className="mt-1 text-base text-heading">{profile.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 text-base text-heading">{profile.email}</dd>
        </div>
        {profile.country ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Country
            </dt>
            <dd className="mt-1 text-base text-heading">{profile.country}</dd>
          </div>
        ) : null}
        {profile.bio ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Bio
            </dt>
            <dd className="mt-1 text-base text-heading">{profile.bio}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

export { AccountProfilePanel };
