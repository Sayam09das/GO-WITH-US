/**
 * GO WITH US — Design System Tokens
 * Source of truth programmatic tokens matching docs/DESIGN_SYSTEM.md and globals.css
 */

export const colors = {
  background: "#FFFFFF",
  foreground: "#141414",

  primary: "#FF6919",
  primaryForeground: "#FFFFFF",

  heading: "#121212",
  body: "#616161",
  mutedForeground: "#808080",

  secondary: "#FFF8F5",
  secondaryForeground: "#E65200",

  card: "#FFFFFF",
  cardForeground: "#141414",

  popover: "#FFFFFF",
  popoverForeground: "#141414",

  section: "#F7FBF8",
  sectionWarm: "#FFF8F5",
  softOrange: "#FFF5F0",
  softGray: "#F7F7F7",

  border: "#E8E8E8",
  input: "#E8E8E8",
  ring: "#FF6919",

  rating: "#F5AB14",
  success: "#1EB854",
  successForeground: "#FFFFFF",
  destructive: "#E53935",
  destructiveForeground: "#FFFFFF",

  // Legacy & Teal Theme Variants
  tealPrimary: "#0D9488",
  tealHover: "#0F766E",
  tealSubtle: "#CCFBF1",
} as const;

export const typography = {
  fontSans: "var(--font-sans), Manrope, system-ui, sans-serif",
  fontDisplay: 'var(--font-display), "Playfair Display", Georgia, serif',
  scale: {
    display: { fontSize: "3.5rem", lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" },
    headingXl: {
      fontSize: "2.5rem",
      lineHeight: "1.2",
      fontWeight: "700",
      letterSpacing: "-0.01em",
    },
    headingLg: {
      fontSize: "2.0rem",
      lineHeight: "1.25",
      fontWeight: "600",
      letterSpacing: "-0.01em",
    },
    headingMd: { fontSize: "1.5rem", lineHeight: "1.3", fontWeight: "600" },
    headingSm: { fontSize: "1.25rem", lineHeight: "1.4", fontWeight: "600" },
    bodyLg: { fontSize: "1.125rem", lineHeight: "1.6", fontWeight: "400" },
    body: { fontSize: "1.0rem", lineHeight: "1.5", fontWeight: "400" },
    bodySm: { fontSize: "0.875rem", lineHeight: "1.4", fontWeight: "400" },
    label: { fontSize: "0.875rem", lineHeight: "1.0", fontWeight: "600" },
    caption: { fontSize: "0.75rem", lineHeight: "1.3", fontWeight: "500", letterSpacing: "0.02em" },
  },
} as const;

export const spacing = {
  space1: "4px",
  space2: "8px",
  space3: "12px",
  space4: "16px",
  space6: "24px",
  space8: "32px",
  space12: "48px",
  space16: "64px",
  space24: "96px",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
} as const;

export const shadows = {
  xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
  sm: "0 2px 8px rgba(0, 0, 0, 0.05)",
  md: "0 6px 20px rgba(0, 0, 0, 0.07)",
  lg: "0 12px 35px rgba(0, 0, 0, 0.09)",
  orange: "0 8px 24px rgba(255, 105, 25, 0.18)",
} as const;

export const motion = {
  durations: {
    fast: "150ms",
    medium: "300ms",
    slow: "500ms",
  },
  easings: {
    easeOutSmooth: "cubic-bezier(0, 0, 0.2, 1)",
    easeInSmooth: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOutSmooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const layout = {
  containerTravel: "1200px",
  containerContent: "1280px",
  containerWide: "1440px",
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  motion,
  layout,
} as const;
