import { HomeHero } from "@/components/hero";
import { AboutSection } from "@/components/landing/about";
import { WhatWeGiveSection } from "@/components/landing/what-we-give";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <AboutSection />
      <WhatWeGiveSection />
    </main>
  );
}
