"use client";

import type {
  ProfilePreferences,
  ProfileTravelInterestId,
  ProfileTravelStyleTagId,
  SavedDestinationSummary,
  UserProfile,
  UserProfileStats,
} from "@gowithus/types";
import { PROFILE_TRAVEL_INTERESTS, PROFILE_TRAVEL_STYLE_TAGS } from "@gowithus/types";
import { LoaderCircle, Upload } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROFILE_ACCOMMODATION_OPTIONS,
  PROFILE_AVATAR_INPUT_ID,
  PROFILE_CURRENCY_OPTIONS,
  PROFILE_LANGUAGE_OPTIONS,
  PROFILE_PACE_OPTIONS,
  PROFILE_PAGE_COPY,
  PROFILE_SECTIONS,
} from "@/lib/account/profile/profile-copy";
import {
  getUserProfileStats,
  listSavedDestinations,
  unsaveDestination,
  updateUserProfile,
  uploadUserAvatar,
} from "@/lib/api/users";
import { cn } from "@/lib/utils";

interface AccountProfilePageShellProps {
  initialProfile: UserProfile;
}

type ProfileDraft = {
  name: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  travelInterests: ProfileTravelInterestId[];
  travelStyleTags: ProfileTravelStyleTagId[];
  preferences: ProfilePreferences;
};

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

function profileToDraft(profile: UserProfile): ProfileDraft {
  return {
    name: profile.name,
    phone: profile.phone ?? "",
    country: profile.country ?? "",
    dateOfBirth: profile.preferences.dateOfBirth ?? "",
    travelInterests: [...profile.travelInterests],
    travelStyleTags: [...profile.travelStyleTags],
    preferences: { ...profile.preferences },
  };
}

function draftSignature(draft: ProfileDraft): string {
  return JSON.stringify(draft);
}

function ProfileSection({
  title,
  description,
  id,
  children,
}: {
  title: string;
  description?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-border/60 pb-10 last:border-b-0 sm:pb-12"
    >
      <div className="mb-6 max-w-xl">
        <h2 className="text-lg font-semibold text-heading sm:text-xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PreferenceChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/10 text-heading"
          : "border-border/70 bg-background text-muted-foreground hover:border-border hover:text-heading",
      )}
    >
      {label}
    </button>
  );
}

function AccountProfilePageShell({ initialProfile }: AccountProfilePageShellProps) {
  const personalRef = useRef<HTMLElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState<ProfileDraft>(() => profileToDraft(initialProfile));
  const [savedSignature, setSavedSignature] = useState(() =>
    draftSignature(profileToDraft(initialProfile)),
  );

  const [stats, setStats] = useState<UserProfileStats | null>(null);
  const [favoriteDestinations, setFavoriteDestinations] = useState<SavedDestinationSummary[]>([]);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => draftSignature(draft) !== savedSignature, [draft, savedSignature]);

  useEffect(() => {
    void getUserProfileStats()
      .then(setStats)
      .catch(() => setStats(null));

    void listSavedDestinations()
      .then(setFavoriteDestinations)
      .catch(() => setFavoriteDestinations([]));
  }, []);

  function toggleInterest(id: ProfileTravelInterestId) {
    setDraft((current) => ({
      ...current,
      travelInterests: current.travelInterests.includes(id)
        ? current.travelInterests.filter((item) => item !== id)
        : [...current.travelInterests, id],
    }));
  }

  function toggleStyleTag(id: ProfileTravelStyleTagId) {
    setDraft((current) => ({
      ...current,
      travelStyleTags: current.travelStyleTags.includes(id)
        ? current.travelStyleTags.filter((item) => item !== id)
        : [...current.travelStyleTags, id],
    }));
  }

  function updatePreference<K extends keyof ProfilePreferences>(
    key: K,
    value: ProfilePreferences[K],
  ) {
    setDraft((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        [key]: value,
      },
    }));
  }

  function handleCancel() {
    setDraft(profileToDraft(profile));
    setSaveError(null);
    setSaveMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      const updated = await updateUserProfile({
        name: draft.name.trim(),
        phone: draft.phone.trim() || undefined,
        country: draft.country.trim() || undefined,
        travelInterests: draft.travelInterests,
        travelStyleTags: draft.travelStyleTags,
        preferences: {
          ...draft.preferences,
          dateOfBirth: draft.dateOfBirth.trim() || null,
        },
      });

      setProfile(updated);
      const nextDraft = profileToDraft(updated);
      setDraft(nextDraft);
      setSavedSignature(draftSignature(nextDraft));
      setSaveMessage(PROFILE_PAGE_COPY.saved);
    } catch {
      setSaveError(PROFILE_PAGE_COPY.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError(null);

    try {
      const updated = await uploadUserAvatar(file);
      setProfile(updated);
    } catch {
      setAvatarError("Could not upload your photo. Try again.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleRemoveFavorite(destinationId: string) {
    try {
      await unsaveDestination(destinationId);
      setFavoriteDestinations((current) =>
        current.filter((item) => item.destinationId !== destinationId),
      );
      const nextStats = await getUserProfileStats();
      setStats(nextStats);
    } catch {
      setSaveError("We couldn't remove that destination.");
    }
  }

  return (
    <>
      <div className={cn("container-travel py-10 sm:py-12 lg:py-14", isDirty && "pb-28")}>
        <header className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <p className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {PROFILE_PAGE_COPY.eyebrow}
          </p>

          <div className="relative mt-8">
            <Avatar className="size-28 border border-border/70 shadow-sm sm:size-32">
              {profile.avatar ? (
                <AvatarImage src={profile.avatar} alt="" />
              ) : (
                <AvatarFallback className="text-2xl font-semibold text-primary">
                  {initialsFromName(profile.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <label
              htmlFor={PROFILE_AVATAR_INPUT_ID}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "absolute right-0 bottom-0 size-10 cursor-pointer rounded-full bg-background shadow-sm",
                isUploadingAvatar && "pointer-events-none opacity-60",
              )}
            >
              {isUploadingAvatar ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Upload aria-hidden="true" className="size-4" />
              )}
              <span className="sr-only">Upload profile photo</span>
            </label>
            <input
              id={PROFILE_AVATAR_INPUT_ID}
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={isUploadingAvatar}
              onChange={handleAvatarChange}
            />
          </div>

          <h1 className="hero-heading mt-6 text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{profile.email}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {PROFILE_PAGE_COPY.memberLabel}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 rounded-full px-5"
            onClick={() => {
              personalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {PROFILE_PAGE_COPY.editProfile}
          </Button>

          {avatarError ? <p className="mt-3 text-sm text-destructive">{avatarError}</p> : null}
          <p className="mt-2 text-xs text-muted-foreground">{PROFILE_PAGE_COPY.avatarHint}</p>
        </header>

        <div className="mx-auto max-w-3xl">
          {saveMessage ? (
            <p role="status" className="mb-6 text-sm text-muted-foreground">
              {saveMessage}
            </p>
          ) : null}
          {saveError ? (
            <p role="status" className="mb-6 text-sm text-destructive">
              {saveError}
            </p>
          ) : null}

          <section
            ref={personalRef}
            id={PROFILE_SECTIONS.personal.id}
            className="scroll-mt-28 border-b border-border/60 pb-10 sm:pb-12"
          >
            <div className="mb-6 max-w-xl">
              <h2 className="text-lg font-semibold text-heading sm:text-xl">
                {PROFILE_SECTIONS.personal.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {PROFILE_SECTIONS.personal.description}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="profile-email">Email address</Label>
                <Input
                  id="profile-email"
                  value={profile.email}
                  readOnly
                  disabled
                  className="bg-muted/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-phone">Phone number</Label>
                <Input
                  id="profile-phone"
                  value={draft.phone}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="+1 555 0100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-country">Country</Label>
                <Input
                  id="profile-country"
                  value={draft.country}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, country: event.target.value }))
                  }
                  placeholder="India"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="profile-dob">Date of birth</Label>
                <Input
                  id="profile-dob"
                  type="date"
                  value={draft.dateOfBirth}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, dateOfBirth: event.target.value }))
                  }
                />
              </div>
            </div>
          </section>

          <ProfileSection
            title={PROFILE_SECTIONS.travel.title}
            description={PROFILE_SECTIONS.travel.description}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-heading">Travel interests</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PROFILE_TRAVEL_INTERESTS.map((interest) => (
                    <PreferenceChip
                      key={interest.id}
                      label={interest.label}
                      selected={draft.travelInterests.includes(interest.id)}
                      onToggle={() => toggleInterest(interest.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-heading">Travel style</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PROFILE_TRAVEL_STYLE_TAGS.map((style) => (
                    <PreferenceChip
                      key={style.id}
                      label={style.label}
                      selected={draft.travelStyleTags.includes(style.id)}
                      onToggle={() => toggleStyleTag(style.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection
            title={PROFILE_SECTIONS.destinations.title}
            description={PROFILE_SECTIONS.destinations.description}
          >
            {favoriteDestinations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoriteDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/20 py-1.5 pr-2 pl-4"
                  >
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="text-sm font-medium text-heading hover:text-primary"
                    >
                      {destination.title}
                    </Link>
                    <button
                      type="button"
                      className="rounded-full px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-heading"
                      onClick={() => void handleRemoveFavorite(destination.destinationId)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Save destinations from Discover to see them here.{" "}
                <Link
                  href="/account/discover"
                  className="font-semibold text-primary hover:underline"
                >
                  Explore destinations
                </Link>
              </p>
            )}
          </ProfileSection>

          <ProfileSection
            title={PROFILE_SECTIONS.account.title}
            description={PROFILE_SECTIONS.account.description}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-currency">Preferred currency</Label>
                <Select
                  value={draft.preferences.preferredCurrency ?? ""}
                  onValueChange={(value) => updatePreference("preferredCurrency", value)}
                >
                  <SelectTrigger id="profile-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_CURRENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-language">Preferred language</Label>
                <Select
                  value={draft.preferences.preferredLanguage ?? ""}
                  onValueChange={(value) => updatePreference("preferredLanguage", value)}
                >
                  <SelectTrigger id="profile-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-pace">Travel pace</Label>
                <Select
                  value={draft.preferences.travelPace ?? ""}
                  onValueChange={(value) => updatePreference("travelPace", value)}
                >
                  <SelectTrigger id="profile-pace">
                    <SelectValue placeholder="How do you like to travel?" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_PACE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-accommodation">Accommodation preference</Label>
                <Select
                  value={draft.preferences.accommodationPreference ?? ""}
                  onValueChange={(value) => updatePreference("accommodationPreference", value)}
                >
                  <SelectTrigger id="profile-accommodation">
                    <SelectValue placeholder="Where do you like to stay?" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_ACCOMMODATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ProfileSection>

          {stats ? (
            <ProfileSection title={PROFILE_SECTIONS.stats.title}>
              <dl className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
                <div>
                  <dt className="text-2xl font-semibold tabular-nums text-heading">
                    {stats.savedPlaces}
                  </dt>
                  <dd className="mt-1 text-muted-foreground">Saved places</dd>
                </div>
                <div>
                  <dt className="text-2xl font-semibold tabular-nums text-heading">
                    {stats.trips}
                  </dt>
                  <dd className="mt-1 text-muted-foreground">Trips</dd>
                </div>
                <div>
                  <dt className="text-2xl font-semibold tabular-nums text-heading">
                    {stats.storiesSaved}
                  </dt>
                  <dd className="mt-1 text-muted-foreground">Stories saved</dd>
                </div>
              </dl>
            </ProfileSection>
          ) : null}
        </div>
      </div>

      {isDirty ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur-sm pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="container-travel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">You have unsaved profile changes.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={isSaving}
                onClick={handleCancel}
              >
                {PROFILE_PAGE_COPY.cancel}
              </Button>
              <Button
                type="button"
                className="rounded-full"
                disabled={isSaving}
                isLoading={isSaving}
                loadingText={PROFILE_PAGE_COPY.saving}
                onClick={() => void handleSave()}
              >
                {PROFILE_PAGE_COPY.saveChanges}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export { AccountProfilePageShell };
