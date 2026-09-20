"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { ABOUT_COPY, ABOUT_STATS } from "@/lib/landing/about";
import { AboutStatCard } from "./about-stat-card";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
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

function AboutContent() {
  const reducedMotion = useReducedMotion();
  const headlineWords = ABOUT_COPY.headline.split(" ").map((word, index, words) => {
    const occurrence = words.slice(0, index).filter((item) => item === word).length;
    return { id: `${word}-${occurrence}`, word };
  });

  return (
    <div className="flex w-full min-w-0 flex-col gap-7 sm:gap-8 lg:gap-10">
      <motion.div
        initial={reducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="flex flex-col gap-4 sm:gap-5"
      >
        <motion.p variants={itemVariants} className="label-text text-primary">
          {ABOUT_COPY.eyebrow}
        </motion.p>

        <h2
          id="about-section-heading"
          className="max-w-xl text-[1.75rem] font-bold leading-[1.15] tracking-tight text-heading sm:text-4xl lg:text-[2.65rem]"
        >
          {headlineWords.map(({ id, word }) => (
            <motion.span key={id} variants={itemVariants} className="mr-[0.28em] inline-block">
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          variants={itemVariants}
          className="max-w-lg text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed md:text-lg"
        >
          {ABOUT_COPY.description}
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 min-[480px]:gap-4">
        {ABOUT_STATS.map((stat, index) => (
          <AboutStatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>
    </div>
  );
}

export { AboutContent };
