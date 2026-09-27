"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { SEARCH_PAGE_COPY } from "@/lib/search";

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

interface SearchHeaderProps {
  query: string;
}

function SearchHeader({ query }: SearchHeaderProps) {
  const reducedMotion = useReducedMotion();
  const title = query ? SEARCH_PAGE_COPY.titleWithQuery(query) : SEARCH_PAGE_COPY.title;

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
        {SEARCH_PAGE_COPY.eyebrow}
      </motion.p>

      <motion.h1
        id="search-page-heading"
        variants={itemVariants}
        className="hero-heading text-2xl font-semibold tracking-tight text-heading sm:text-3xl lg:text-4xl"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-sm leading-relaxed text-muted-foreground sm:text-base"
      >
        {query ? SEARCH_PAGE_COPY.statusWithQuery(query) : SEARCH_PAGE_COPY.subtitle}
      </motion.p>
    </motion.header>
  );
}

export { SearchHeader };
