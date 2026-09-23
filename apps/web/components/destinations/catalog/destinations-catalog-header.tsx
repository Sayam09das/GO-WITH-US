"use client";

import { motion } from "motion/react";
import { DESTINATIONS_CATALOG_COPY } from "@/lib/destinations";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ENTRANCE_EASE },
  },
};

function DestinationsCatalogHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants}
      className="flex max-w-2xl flex-col gap-3 sm:gap-4"
    >
      <motion.p
        variants={itemVariants}
        className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {DESTINATIONS_CATALOG_COPY.eyebrow}
      </motion.p>

      <motion.h2
        id="destinations-catalog-heading"
        variants={itemVariants}
        className="hero-heading text-2xl font-semibold tracking-tight text-heading sm:text-3xl lg:text-4xl"
      >
        {DESTINATIONS_CATALOG_COPY.title}
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-sm leading-relaxed text-muted-foreground sm:text-base"
      >
        {DESTINATIONS_CATALOG_COPY.subtitle}
      </motion.p>
    </motion.header>
  );
}

export { DestinationsCatalogHeader };
