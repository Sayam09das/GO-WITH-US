"use client";

import { Plane } from "lucide-react";
import { motion } from "motion/react";
import { HERO_COPY } from "@/lib/hero";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { HeroSearchBar } from "./hero-search-bar";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: ENTRANCE_EASE },
  },
};

function HeroContent() {
  const reducedMotion = useReducedMotion();
  const headlineWords = HERO_COPY.headline.split(" ").map((word, index, words) => {
    const occurrence = words.slice(0, index).filter((item) => item === word).length;
    return { id: `${word}-${occurrence}`, word };
  });

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <motion.div
        initial={reducedMotion ? "visible" : "hidden"}
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-5"
      >
        <motion.p
          variants={itemVariants}
          className="label-text inline-flex items-center gap-2 text-primary"
        >
          <Plane aria-hidden="true" className="size-4 rotate-[-12deg]" />
          {HERO_COPY.eyebrow}
        </motion.p>

        <h1
          id="home-hero-heading"
          className="max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-heading sm:text-5xl lg:text-[3.25rem]"
        >
          {headlineWords.map(({ id, word }) => (
            <motion.span key={id} variants={itemVariants} className="mr-[0.28em] inline-block">
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={itemVariants}
          className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {HERO_COPY.subheadline}
        </motion.p>
      </motion.div>

      <HeroSearchBar />
    </div>
  );
}

export { HeroContent };
