"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_JOURNAL_COPY } from "@/lib/landing/travel-journal";

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
    transition: { duration: 0.55, ease: ENTRANCE_EASE },
  },
};

function TravelJournalHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      data-tj-header
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-12 xl:gap-16"
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <p className="label-text text-primary">{TRAVEL_JOURNAL_COPY.eyebrow}</p>
          <span
            data-tj-issue
            aria-hidden="true"
            className="hidden h-px flex-1 bg-border sm:block"
          />
          <span
            data-tj-issue
            className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline"
          >
            Issue 01
          </span>
        </motion.div>

        <motion.h2
          id="travel-journal-heading"
          variants={itemVariants}
          className="section-heading max-w-2xl text-[2rem] leading-[1.08] text-heading sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]"
        >
          Stories for the <span className="italic text-primary">road ahead.</span>
        </motion.h2>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-5 border-border sm:gap-6 lg:border-l lg:pl-8 xl:pl-10"
      >
        <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {TRAVEL_JOURNAL_COPY.supporting}
        </p>

        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={TRAVEL_JOURNAL_COPY.viewJournalHref}>
            {TRAVEL_JOURNAL_COPY.viewJournal}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

export { TravelJournalHeader };
