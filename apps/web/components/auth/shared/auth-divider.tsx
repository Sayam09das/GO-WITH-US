interface AuthDividerProps {
  label: string;
}

function AuthDivider({ label }: AuthDividerProps) {
  return (
    <div data-auth-reveal className="relative will-change-transform">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-background px-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export { AuthDivider };
