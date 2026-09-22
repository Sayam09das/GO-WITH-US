"use client";

import { motion } from "motion/react";
import { DESTINATIONS_HERO_COPY } from "@/lib/destinations";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ENTRANCE_EASE },
  },
};

function DestinationsHeroContent() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? "visible" : "hidden"}
      animate="visible"
      variants={containerVariants}
      className="flex max-w-3xl flex-col gap-4 sm:gap-5"
    >
      <motion.p
        variants={itemVariants}
        className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {DESTINATIONS_HERO_COPY.eyebrow}
      </motion.p>

      <h1
        id="destinations-hero-heading"
        data-dest-heading
        className="hero-heading text-[2.125rem] font-semibold leading-[1.08] tracking-tight text-heading sm:text-5xl lg:text-[3.5rem]"
      >
        {DESTINATIONS_HERO_COPY.headline}
      </h1>

      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg"
      >
        {DESTINATIONS_HERO_COPY.intro}
      </motion.p>
    </motion.div>
  );
}

export { DestinationsHeroContent };
