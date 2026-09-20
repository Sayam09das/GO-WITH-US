import type * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function Field({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field"
      className={cn("flex min-w-0 flex-col gap-2 border-0 p-0", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
  return (
    <Label className={cn(className)} {...props}>
      {children}
      {required ? (
        <span className="text-destructive" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </Label>
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldLabel };
