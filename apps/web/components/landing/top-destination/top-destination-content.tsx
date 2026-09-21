"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TOP_DESTINATION_COPY } from "@/lib/landing/top-destination";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: ENTRANCE_EASE },
  },
};

function TopDestinationContent() {
  const reducedMotion = useReducedMotion();
  const headlineWords = TOP_DESTINATION_COPY.headline.split(" ").map((word, index, words) => {
    const occurrence = words.slice(0, index).filter((item) => item === word).length;
    return { id: `${word}-${occurrence}`, word };
  });

  return (
    <motion.div
      data-td-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:gap-5"
    >
      <motion.p variants={itemVariants} className="label-text text-primary">
        {TOP_DESTINATION_COPY.eyebrow}
      </motion.p>

      <h2
        id="top-destination-heading"
        className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]"
      >
        {headlineWords.map(({ id, word }) => (
          <motion.span key={id} variants={itemVariants} className="mr-[0.28em] inline-block">
            {word}
          </motion.span>
        ))}
      </h2>

      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg"
      >
        {TOP_DESTINATION_COPY.description}
      </motion.p>
    </motion.div>
  );
}

export { TopDestinationContent };
