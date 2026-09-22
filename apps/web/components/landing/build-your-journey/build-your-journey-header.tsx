"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { BUILD_YOUR_JOURNEY_COPY } from "@/lib/landing/build-your-journey";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ENTRANCE_EASE },
  },
};

function BuildYourJourneyHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      data-byj-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:gap-4"
    >
      <motion.p variants={itemVariants} className="label-text text-primary">
        {BUILD_YOUR_JOURNEY_COPY.eyebrow}
      </motion.p>

      <motion.h2
        id="build-your-journey-heading"
        variants={itemVariants}
        className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-heading sm:text-4xl lg:text-[2.65rem]"
      >
        {BUILD_YOUR_JOURNEY_COPY.headline}{" "}
        <span aria-hidden="true">{BUILD_YOUR_JOURNEY_COPY.emoji}</span>
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg"
      >
        {BUILD_YOUR_JOURNEY_COPY.supporting}
      </motion.p>
    </motion.div>
  );
}

export { BuildYourJourneyHeader };
