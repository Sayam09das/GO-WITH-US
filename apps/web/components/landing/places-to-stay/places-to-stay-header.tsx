"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { PLACES_TO_STAY_COPY } from "@/lib/landing/places-to-stay";

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

function PlacesToStayHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      data-pts-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
    >
      <div className="flex max-w-2xl flex-col gap-3 sm:gap-4">
        <motion.p variants={itemVariants} className="label-text text-primary">
          {PLACES_TO_STAY_COPY.eyebrow}
        </motion.p>

        <motion.h2
          id="places-to-stay-heading"
          variants={itemVariants}
          className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-heading sm:text-4xl lg:text-[2.65rem]"
        >
          {PLACES_TO_STAY_COPY.headline}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg"
        >
          {PLACES_TO_STAY_COPY.supporting}
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="shrink-0 sm:pb-1">
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={PLACES_TO_STAY_COPY.viewAllHref}>
            {PLACES_TO_STAY_COPY.viewAll}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

export { PlacesToStayHeader };
