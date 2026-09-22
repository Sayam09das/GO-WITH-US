"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { FooterNewsletterForm } from "@/components/layout/footer-newsletter-form";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FOOTER_COPY, FOOTER_LINK_GROUPS, FOOTER_SOCIAL_LINKS } from "@/lib/layout/footer";
import { cn } from "@/lib/utils";

function SiteFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const year = new Date().getFullYear();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (reducedMotion || !section) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-footer-reveal]", { autoAlpha: 0, y: 18 });

      gsap.to("[data-footer-reveal]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: section,
          start: "top 94%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer
      ref={sectionRef}
      className={cn(
        "border-t border-border/70 bg-soft-gray",
        reducedMotion && "[&_[data-footer-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-10 lg:gap-12">
          <div
            data-footer-reveal
            className="flex flex-col gap-6 will-change-transform lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          >
            <Link
              href="/"
              aria-label="GO WITH US — Home"
              className="group inline-flex w-fit items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-xs"
              >
                G
              </span>
              <span className="hero-heading text-xl font-semibold tracking-tight text-heading sm:text-2xl">
                GO WITH US
              </span>
            </Link>

            <FooterNewsletterForm />
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title} data-footer-reveal className="will-change-transform">
                <p className="mb-4 text-base font-semibold text-heading">{group.title}</p>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-heading sm:text-[0.9375rem]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div data-footer-reveal className="will-change-transform">
              <p className="mb-4 text-base font-semibold text-heading">Social Media</p>
              <div className="flex items-center gap-4">
                {FOOTER_SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <p
            data-footer-reveal
            className="text-xs text-muted-foreground will-change-transform sm:text-sm"
          >
            © {year} {FOOTER_COPY.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
