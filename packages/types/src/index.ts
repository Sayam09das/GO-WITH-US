export type BudgetTier = "budget" | "moderate" | "luxury";

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  avatarUrl: string | null;
  bio: string | null;
  homeCity: string | null;
  travelStyles: string[];
  budgetPreference: BudgetTier | null;
};

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiDataEnvelope<T> = {
  data: T;
};
