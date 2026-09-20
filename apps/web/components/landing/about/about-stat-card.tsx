"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { AboutStat } from "@/lib/landing/about";
import { cn } from "@/lib/utils";

interface AboutStatCardProps {
  stat: AboutStat;
  index: number;
}

function AboutStatCard({ stat, index }: AboutStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const valueEl = valueRef.current;
    const cardEl = cardRef.current;
    if (!valueEl || !cardEl) {
      return;
    }

    valueEl.textContent = String(stat.value);

    if (reducedMotion) {
      return;
    }

    registerGsapPlugins();
    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: stat.value,
        duration: 1.35,
        ease: "power2.out",
        snap: { val: 1 },
        delay: index * 0.08,
        scrollTrigger: {
          trigger: cardEl,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          valueEl.textContent = String(Math.round(counter.val));
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index, reducedMotion, stat.value]);

  return (
    <motion.div
      ref={cardRef}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0, 0, 0.2, 1] }}
      className={cn(
        "rounded-2xl bg-soft-gray px-4 py-4 text-center transition-shadow duration-200 sm:px-5 sm:py-5",
        "hover:shadow-sm motion-reduce:transition-none",
      )}
    >
      <p className="text-price text-2xl text-heading min-[480px]:text-3xl sm:text-4xl">
        <span ref={valueRef}>{stat.value}</span>
        {stat.suffix}
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

export { AboutStatCard };
