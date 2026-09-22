import { SiteFooter } from "@/components/layout";
import { Navbar } from "@/components/navigation";
import { AppProviders } from "@/components/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { buildRootMetadata, buildWebSiteJsonLd } from "@/lib/seo";
import { fontDisplay, fontSans } from "./fonts";
import "./globals.css";

export const metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <JsonLd data={buildWebSiteJsonLd()} />
        <AppProviders>
          <Navbar />
          {children}
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
