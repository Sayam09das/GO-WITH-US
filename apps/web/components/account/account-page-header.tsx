import { cn } from "@/lib/utils";

interface AccountPageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

function AccountPageHeader({ title, description, className }: AccountPageHeaderProps) {
  return (
    <div className={cn("mb-8 max-w-2xl", className)}>
      <h1 className="section-heading text-3xl text-heading sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

export { AccountPageHeader };
