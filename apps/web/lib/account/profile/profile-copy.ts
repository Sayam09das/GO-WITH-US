export const PROFILE_PAGE_COPY = {
  eyebrow: "YOUR PROFILE",
  memberLabel: "GO WITH US member",
  editProfile: "Edit profile",
  saveChanges: "Save changes",
  cancel: "Cancel",
  saving: "Saving…",
  saved: "Profile updated.",
  saveError: "We couldn't save your profile. Try again.",
  avatarHint: "JPG, PNG, or WebP",
} as const;

export const PROFILE_SECTIONS = {
  personal: {
    id: "profile-personal",
    title: "Personal information",
    description: "The essentials we use to personalize your account.",
  },
  travel: {
    title: "Travel preferences",
    description: "Tell us what kind of journeys you love—this shapes future recommendations.",
  },
  destinations: {
    title: "Favorite destinations",
    description: "Destinations you've saved and want close at hand.",
  },
  account: {
    title: "Profile preferences",
    description: "Defaults for currency, language, and how you like to travel.",
  },
  stats: {
    title: "At a glance",
  },
} as const;

export const PROFILE_CURRENCY_OPTIONS = [
  { value: "USD", label: "USD · US Dollar" },
  { value: "EUR", label: "EUR · Euro" },
  { value: "GBP", label: "GBP · British Pound" },
  { value: "JPY", label: "JPY · Japanese Yen" },
  { value: "INR", label: "INR · Indian Rupee" },
  { value: "AUD", label: "AUD · Australian Dollar" },
] as const;

export const PROFILE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "hi", label: "Hindi" },
] as const;

export const PROFILE_PACE_OPTIONS = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "packed", label: "Packed days" },
] as const;

export const PROFILE_ACCOMMODATION_OPTIONS = [
  { value: "boutique", label: "Boutique stays" },
  { value: "luxury", label: "Luxury hotels" },
  { value: "apartments", label: "Apartments" },
  { value: "hostels", label: "Social stays" },
  { value: "mixed", label: "Mix it up" },
] as const;

export const PROFILE_AVATAR_INPUT_ID = "profile-avatar-upload";
