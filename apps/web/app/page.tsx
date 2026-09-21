import { HomeHero } from "@/components/hero";
import { AboutSection } from "@/components/landing/about";
import { TopDestinationSection } from "@/components/landing/top-destination";
import { WhatWeGiveSection } from "@/components/landing/what-we-give";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <AboutSection />
      <WhatWeGiveSection />
      <TopDestinationSection />
    </main>
  );
}
