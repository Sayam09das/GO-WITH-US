"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
  onChange: (value: string) => void;
}

function PasswordInput({
  id,
  name,
  value,
  placeholder,
  autoComplete = "current-password",
  className,
  onChange,
  ...ariaProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        className={cn("h-12 rounded-xl bg-soft-gray/80 pr-12", className)}
        onChange={(event) => onChange(event.target.value)}
        {...ariaProps}
      />
      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onClick={() => setShowPassword((current) => !current)}
      >
        {showPassword ? (
          <EyeOff aria-hidden="true" className="size-4" />
        ) : (
          <Eye aria-hidden="true" className="size-4" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
