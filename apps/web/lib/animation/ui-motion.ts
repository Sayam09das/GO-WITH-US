/** Motion durations for UI chrome — dialogs, sheets, dropdowns, tabs. */
export const UI_MOTION_DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
} as const;

/** Tailwind classes that disable motion when the user prefers reduced motion. */
export const REDUCED_MOTION_CLASSES = "motion-reduce:animate-none motion-reduce:transition-none";

/** Default transition for overlay surfaces (Dialog, Sheet). */
export const overlayMotionClasses = cnMotion(
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
  REDUCED_MOTION_CLASSES,
);

/** Default transition for modal content surfaces. */
export const contentMotionClasses = cnMotion(
  "duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  REDUCED_MOTION_CLASSES,
);

function cnMotion(...classes: string[]) {
  return classes.join(" ");
}
