import { BookOpen, LifeBuoy, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

const HELP_TOPICS = [
  {
    icon: BookOpen,
    title: "Planning your first trip",
    description: "Save places, create a trip, and build a day-by-day outline at your pace.",
    href: "/trips",
    cta: "Open My trips",
  },
  {
    icon: MessageCircle,
    title: "Using saved places",
    description: "Keep destinations, stays, and experiences in one calm list for later.",
    href: "/saved",
    cta: "View saved",
  },
  {
    icon: LifeBuoy,
    title: "Account & sign-in",
    description: "Session cookies stay on this site — sign in again if lists look empty.",
    href: "/account/profile",
    cta: "Check profile",
  },
  {
    icon: Mail,
    title: "Contact support",
    description: "Reach the team for bugs, feedback, or help with your account.",
    href: "mailto:hello@gowithus.com",
    cta: "Email us",
  },
] as const;

function AccountHelpSections() {
  return (
    <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
      {HELP_TOPICS.map((topic) => {
        const Icon = topic.icon;
        const external = topic.href.startsWith("mailto:");

        return (
          <article
            key={topic.title}
            className="flex flex-col rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-section text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-heading">{topic.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {topic.description}
            </p>
            <Link
              href={topic.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-primary hover:underline"
            >
              {topic.cta}
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export { AccountHelpSections };
