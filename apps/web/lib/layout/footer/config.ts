import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const FOOTER_COPY = {
  emailPlaceholder: "Your email",
  emailLabel: "Email address",
  invalidEmail: "Enter a valid email address.",
  subscribe: "Subscribe to newsletter",
  successMessage: "You're subscribed.",
  copyright: "GO WITH US. Copyright and all rights reserved.",
} as const;

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "About",
    links: [
      { label: "About us", href: "/#about" },
      { label: "Features", href: "/#what-we-give" },
      { label: "Journal", href: "/journal" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our team", href: "/about/team" },
      { label: "Partner with us", href: "/partners" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/journal" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Account", href: "/account" },
      { label: "Support center", href: "/support" },
      { label: "Feedback", href: "/feedback" },
      { label: "Contact us", href: "/contact" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
];
