export interface PrivacyPolicySection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const PRIVACY_POLICY_COPY = {
  title: "Privacy Policy",
  lastUpdated: "September 22, 2026",
  intro:
    "GO WITH US is built for travelers who want to discover places, save inspiration, and plan trips with clarity. This policy explains what we collect, why we collect it, and the choices you have.",
  contactLabel: "Questions about privacy?",
  contactDescription: "Reach our team anytime and we will respond within a reasonable timeframe.",
  contactEmail: "privacy@gowithus.com",
  contactHref: "mailto:privacy@gowithus.com",
} as const;

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "We collect information you provide directly, such as your name, email address, and account credentials when you sign up or contact us.",
      "When you use GO WITH US, we also collect usage data — including saved destinations, trips, itinerary details, and preferences — to power discovery and planning features.",
      "We may receive limited technical data from your device, such as browser type, approximate location, and log information needed to keep the platform secure and reliable.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How we use your information",
    paragraphs: [
      "We use your information to operate, improve, and personalize the GO WITH US experience.",
    ],
    bullets: [
      "Create and manage your account",
      "Save destinations, stays, and experiences you choose",
      "Build and organize your trips and itineraries",
      "Send product updates or newsletters you opt into",
      "Protect the platform from abuse, fraud, and security threats",
    ],
  },
  {
    id: "sharing-and-disclosure",
    title: "Sharing and disclosure",
    paragraphs: [
      "We do not sell your personal information or travel preferences to third-party advertising networks.",
      "We may share limited data with trusted service providers who help us run GO WITH US — such as hosting, analytics, and email delivery — under strict confidentiality obligations.",
      "We may disclose information when required by law or when necessary to protect the rights, safety, and integrity of our users and platform.",
    ],
  },
  {
    id: "data-retention",
    title: "Data retention",
    paragraphs: [
      "We retain account and trip data for as long as your account is active or as needed to provide the service.",
      "You may request deletion of your account and associated data at any time through account settings or by contacting us directly.",
    ],
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, export, or delete your personal information.",
    ],
    bullets: [
      "Update profile details from your account settings",
      "Unsubscribe from marketing emails at any time",
      "Request a copy or deletion of your data by contacting privacy@gowithus.com",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We use industry-standard safeguards — including encrypted connections and secure password handling — to protect your account and travel data in transit and at rest.",
      "No method of transmission or storage is completely secure, but we continuously work to reduce risk and respond to incidents responsibly.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    paragraphs: [
      "GO WITH US uses cookies and similar technologies to keep you signed in, remember preferences, and understand how the product is used.",
      "You can control cookies through your browser settings. Disabling certain cookies may limit parts of the experience.",
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      "GO WITH US is not directed to children under 13, and we do not knowingly collect personal information from children.",
      "If you believe a child has provided us with personal data, please contact us so we can remove it.",
    ],
  },
  {
    id: "policy-changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the date at the top of this page.",
      "Material changes will be communicated through the product or by email where appropriate.",
    ],
  },
];
