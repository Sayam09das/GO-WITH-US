"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FINAL_CTA_COPY } from "@/lib/landing/final-cta";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ENTRANCE_EASE },
  },
};

function FinalCtaHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      data-fcta-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:gap-5"
    >
      <motion.p variants={itemVariants} className="label-text text-primary">
        {FINAL_CTA_COPY.eyebrow}
      </motion.p>

      <motion.h2
        id="final-cta-heading"
        variants={itemVariants}
        className="section-heading text-[2.125rem] leading-[1.08] text-heading sm:text-5xl lg:text-[3.5rem]"
      >
        {FINAL_CTA_COPY.headline}{" "}
        <span aria-hidden="true" className="inline-block not-italic">
          {FINAL_CTA_COPY.emoji}
        </span>
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg"
      >
        {FINAL_CTA_COPY.supporting}
      </motion.p>
    </motion.div>
  );
}

export { FinalCtaHeader };
