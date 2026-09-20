import localFont from "next/font/local";

export const fontSans = localFont({
  src: "../public/fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-sans",
  display: "swap",
});

export const fontDisplay = localFont({
  src: "../public/fonts/PlayfairDisplay-VariableFont_wght.ttf",
  variable: "--font-display",
  display: "swap",
});
