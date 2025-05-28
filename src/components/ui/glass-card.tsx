import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/5 shadow-xl backdrop-blur-lg transition-all hover:shadow-2xl",
        "p-6", // Default padding
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({ className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("pb-4 border-b border-white/10 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-xl font-semibold text-primary", className)} {...props}>
      {children}
    </h3>
  );
}

export function GlassCardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-foreground/80", className)} {...props}>
      {children}
    </p>
  );
}

export function GlassCardContent({ className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardFooter({ className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("pt-4 border-t border-white/10 mt-4", className)} {...props}>
      {children}
    </div>
  );
}
