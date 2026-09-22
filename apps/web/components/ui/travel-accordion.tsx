"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TravelAccordionItem {
  question: string;
  answer: React.ReactNode;
}

export interface TravelAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TravelAccordionItem[];
  title?: string;
  defaultOpenIndex?: number | null;
}

function TravelAccordion({
  items,
  title,
  defaultOpenIndex = 0,
  className,
  ...props
}: TravelAccordionProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className={cn("relative w-full font-sans", className)} {...props}>
      {title ? (
        <h3 className="mb-8 text-center text-lg font-semibold text-muted-foreground sm:text-xl">
          {title}
        </h3>
      ) : null}

      <ul className="mx-auto flex w-full list-none flex-col p-0">
        {items.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <li
              key={item.question}
              className={cn(
                "relative w-full transition-all duration-300 ease-in",
                "border-b border-border/80 last:border-b-0",
                isActive && "border-border",
              )}
            >
              <button
                type="button"
                className={cn(
                  "relative m-0 flex min-h-[3.75rem] w-full cursor-pointer flex-row items-center justify-start px-4 py-4 pl-14 text-left text-base outline-none transition-colors duration-200 md:min-h-[4rem] md:pl-16 md:text-lg",
                  "border-l-[6px] md:border-l-[10px]",
                  isActive
                    ? "border-l-primary bg-soft-orange/70 font-semibold text-heading"
                    : "border-l-border bg-transparent text-muted-foreground hover:border-l-primary/45 hover:bg-soft-orange/35 hover:text-heading",
                )}
                onClick={() => toggleItem(index)}
                aria-expanded={isActive}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 leading-none transition-all duration-200 md:left-5",
                    isActive
                      ? "text-[2rem] font-normal text-primary md:text-[2.5rem]"
                      : "text-2xl font-normal text-muted-foreground/70 md:text-[1.875rem]",
                  )}
                >
                  {isActive ? "−" : "+"}
                </span>

                <span className="pr-10">{item.question}</span>

                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-6 block size-2 border-t-[3px] border-r-[3px] transition-transform duration-200 ease-in-out",
                    isActive
                      ? "rotate-[-44deg] border-primary"
                      : "rotate-[133deg] border-muted-foreground/50",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid w-full border-l-[6px] transition-all duration-300 ease-in-out md:border-l-[10px]",
                  isActive
                    ? "grid-rows-[1fr] border-l-primary bg-soft-orange/70"
                    : "grid-rows-[0fr] border-l-border bg-transparent",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex w-full flex-row items-start justify-start px-4 pt-2 pb-6 pl-14 text-base font-normal text-muted-foreground md:pl-16 md:text-lg">
                    <div className="flex flex-col gap-3 opacity-95">{item.answer}</div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { TravelAccordion };
