"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TravelAccordion } from "@/components/ui/travel-accordion";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FINAL_CTA_COPY, FINAL_CTA_PROMPTS } from "@/lib/landing/final-cta";
import { cn } from "@/lib/utils";
import { FinalCtaHeader } from "./final-cta-header";

function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const accordionItems = FINAL_CTA_PROMPTS.map((prompt) => ({
    question: prompt.question,
    answer: (
      <>
        <p>{prompt.answer}</p>
        <Link
          href={prompt.href}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5 sm:text-base"
        >
          {prompt.linkLabel}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </>
    ),
  }));

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;

    if (reducedMotion || !section || !panel) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-fcta-panel]", { autoAlpha: 0, y: 36 });
      gsap.set("[data-fcta-accordion]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-fcta-actions]", { autoAlpha: 0, y: 16 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-fcta-panel]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
        })
        .to(
          "[data-fcta-accordion]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.45",
        )
        .to(
          "[data-fcta-actions]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.25",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="final-cta-heading"
      className={cn(
        "travel-section relative overflow-hidden",
        reducedMotion &&
          "[&_[data-fcta-accordion]]:opacity-100 [&_[data-fcta-actions]]:opacity-100 [&_[data-fcta-panel]]:opacity-100",
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/landingImg/hero/hero-boardwalk.jpg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      </div>

      <div className="container-travel relative">
        <div
          ref={panelRef}
          data-fcta-panel
          className="mx-auto flex max-w-4xl flex-col gap-10 rounded-[1.75rem] border border-border/70 bg-card/75 px-5 py-10 shadow-sm backdrop-blur-md will-change-transform sm:gap-12 sm:rounded-[2rem] sm:px-8 sm:py-12 lg:px-12 lg:py-14"
        >
          <FinalCtaHeader />

          <div data-fcta-accordion className="will-change-transform">
            <TravelAccordion
              title={FINAL_CTA_COPY.accordionTitle}
              items={accordionItems}
              defaultOpenIndex={0}
            />
          </div>

          <div
            data-fcta-actions
            className="flex flex-col items-center justify-center gap-3 will-change-transform sm:flex-row sm:gap-4"
          >
            <Button asChild size="lg" className="w-full min-[480px]:w-auto">
              <Link href={FINAL_CTA_COPY.primaryHref}>
                {FINAL_CTA_COPY.primaryCta}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full min-[480px]:w-auto">
              <Link href={FINAL_CTA_COPY.secondaryHref}>
                {FINAL_CTA_COPY.secondaryCta}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FinalCtaSection };
