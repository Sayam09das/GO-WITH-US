import { HeroCollage } from "./hero-collage";
import { HeroContent } from "./hero-content";

function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden bg-background pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div className="container-travel">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
          <HeroContent />
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}

export { HomeHero };
