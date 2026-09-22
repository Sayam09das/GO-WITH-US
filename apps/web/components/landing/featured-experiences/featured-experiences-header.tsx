"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FEATURED_EXPERIENCES_COPY } from "@/lib/landing/featured-experiences";

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

function FeaturedExperiencesHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      data-fe-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="flex flex-col items-center gap-5 text-center sm:gap-6"
    >
      <motion.p variants={itemVariants} className="label-text text-primary">
        {FEATURED_EXPERIENCES_COPY.eyebrow}
      </motion.p>

      <motion.h2
        id="featured-experiences-heading"
        variants={itemVariants}
        className="max-w-2xl text-[1.75rem] font-bold leading-[1.12] tracking-tight text-heading sm:text-4xl"
      >
        {FEATURED_EXPERIENCES_COPY.headline}
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base"
      >
        {FEATURED_EXPERIENCES_COPY.supporting}
      </motion.p>

      <motion.div variants={itemVariants}>
        <Button asChild variant="outline" size="lg">
          <Link href="/experiences">
            {FEATURED_EXPERIENCES_COPY.cta}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

export { FeaturedExperiencesHeader };
