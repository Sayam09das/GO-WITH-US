import Link from "next/link";

interface AuthBrandHeaderProps {
  title: string;
  subtitle: string;
}

function AuthBrandHeader({ title, subtitle }: AuthBrandHeaderProps) {
  return (
    <div data-auth-reveal className="will-change-transform">
      <Link
        href="/"
        aria-label="GO WITH US — Home"
        className="group mb-8 inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
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

      <div className="flex flex-col gap-2">
        <h1 className="hero-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
      </div>
    </div>
  );
}

export { AuthBrandHeader };
