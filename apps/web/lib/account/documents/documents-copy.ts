export type DocumentCategory =
  | "all"
  | "bookings"
  | "flights"
  | "stays"
  | "experiences"
  | "invoices"
  | "other";

export interface TravelDocumentItem {
  id: string;
  name: string;
  tripLabel: string;
  dateLabel: string;
  fileType: string;
  fileSizeLabel: string;
  category: Exclude<DocumentCategory, "all">;
}

export const DOCUMENTS_PAGE_COPY = {
  eyebrow: "TRAVEL ESSENTIALS",
  heading: "Travel Documents",
  supporting: "Keep your confirmations, tickets, invoices, and travel details together.",
  addDocument: "Add document",
  uploadTitle: "Drop your document here",
  uploadSupporting: "or browse files",
  uploadHint: "PDF · JPG · PNG",
  view: "View",
  download: "Download",
} as const;

export const DOCUMENTS_TABS = [
  { id: "all", label: "All" },
  { id: "bookings", label: "Bookings" },
  { id: "flights", label: "Flights" },
  { id: "stays", label: "Stays" },
  { id: "experiences", label: "Experiences" },
  { id: "invoices", label: "Invoices" },
  { id: "other", label: "Other" },
] as const;

export type DocumentsTabId = (typeof DOCUMENTS_TABS)[number]["id"];

export const DOCUMENTS_EMPTY_COPY = {
  title: "Your travel documents will live here.",
  description:
    "Booking confirmations, tickets, and invoices will appear here as you plan your journeys.",
  action: "Explore trips",
  href: "/trips",
} as const;

export const DOCUMENTS_BOTTOM_CTA = {
  heading: "Stay organized on the road",
  supporting: "Upload confirmations and tickets so everything is ready before you go.",
  action: "View bookings",
  href: "/account/bookings",
} as const;

/** Placeholder until documents API ships. */
export const TRAVEL_DOCUMENTS_FIXTURE: TravelDocumentItem[] = [];
