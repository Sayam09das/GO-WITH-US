"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { PRIVACY_POLICY_COPY, PRIVACY_POLICY_SECTIONS } from "@/lib/legal/privacy";
import { cn } from "@/lib/utils";

function PrivacyPolicyPage() {
  const mainRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (reducedMotion || !main) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-privacy-reveal]", { autoAlpha: 0, y: 20 });

      gsap.to("[data-privacy-reveal]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: main,
          start: "top 88%",
          once: true,
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <main
      ref={mainRef}
      className={cn(
        "bg-background pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32",
        reducedMotion && "[&_[data-privacy-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel mx-auto max-w-3xl">
        <header data-privacy-reveal className="mb-10 will-change-transform sm:mb-12">
          <div
            aria-hidden="true"
            className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-section text-primary"
          >
            <ShieldCheck className="size-5" />
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Last updated {PRIVACY_POLICY_COPY.lastUpdated}
          </p>
          <h1 className="hero-heading mb-4 text-3xl font-semibold tracking-tight text-heading sm:text-4xl lg:text-[2.5rem]">
            {PRIVACY_POLICY_COPY.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {PRIVACY_POLICY_COPY.intro}
          </p>
        </header>

        <nav
          aria-label="Privacy policy sections"
          data-privacy-reveal
          className="mb-10 rounded-2xl border border-border/70 bg-soft-gray p-5 will-change-transform sm:mb-12 sm:p-6"
        >
          <p className="mb-3 text-sm font-semibold text-heading">On this page</p>
          <ol className="grid gap-2 sm:grid-cols-2">
            {PRIVACY_POLICY_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-heading"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-10 sm:gap-12">
          {PRIVACY_POLICY_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              data-privacy-reveal
              className="scroll-mt-28 will-change-transform"
            >
              <h2
                id={`${section.id}-heading`}
                className="mb-4 text-xl font-semibold tracking-tight text-heading sm:text-2xl"
              >
                {section.title}
              </h2>
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets ? (
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <aside
          data-privacy-reveal
          className="mt-12 rounded-2xl border border-primary/15 bg-section p-6 will-change-transform sm:mt-14 sm:p-8"
        >
          <h2 className="mb-2 text-lg font-semibold text-heading">
            {PRIVACY_POLICY_COPY.contactLabel}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {PRIVACY_POLICY_COPY.contactDescription}
          </p>
          <a
            href={PRIVACY_POLICY_COPY.contactHref}
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline sm:text-base"
          >
            {PRIVACY_POLICY_COPY.contactEmail}
          </a>
          <p className="mt-5 text-sm text-muted-foreground">
            Return to{" "}
            <Link href="/" className="font-medium text-heading underline-offset-4 hover:underline">
              home
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}

export { PrivacyPolicyPage };
