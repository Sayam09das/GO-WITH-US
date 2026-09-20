"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { WHAT_WE_GIVE_COPY } from "@/lib/landing/what-we-give";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ENTRANCE_EASE },
  },
};

function WhatWeGiveContent() {
  const reducedMotion = useReducedMotion();
  const headlineWords = WHAT_WE_GIVE_COPY.headline.split(" ").map((word, index, words) => {
    const occurrence = words.slice(0, index).filter((item) => item === word).length;
    return { id: `${word}-${occurrence}`, word };
  });

  return (
    <motion.div
      data-wwg-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      className="flex max-w-md flex-col gap-4 sm:gap-5 lg:max-w-sm xl:max-w-md"
    >
      <motion.p variants={itemVariants} className="label-text text-primary">
        {WHAT_WE_GIVE_COPY.eyebrow}
      </motion.p>

      <h2
        id="what-we-give-heading"
        className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-heading sm:text-4xl lg:text-[2.65rem]"
      >
        {headlineWords.map(({ id, word }) => (
          <motion.span key={id} variants={itemVariants} className="mr-[0.28em] inline-block">
            {word}
          </motion.span>
        ))}
      </h2>

      <motion.p
        variants={itemVariants}
        className="text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg"
      >
        {WHAT_WE_GIVE_COPY.description}
      </motion.p>
    </motion.div>
  );
}

export { WhatWeGiveContent };
