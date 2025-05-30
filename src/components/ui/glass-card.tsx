
"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
}

// Inner component to hold the actual card content
const GlassCardInnerContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground w-full h-full",
        "p-5 md:p-6",
        "relative z-10", // Ensure content is above any pseudo-elements if used by border parent
        className
      )}
      // Adjust inner radius if the parent has a border thickness applied via padding
      style={{ borderRadius: `calc(var(--radius) - var(--neon-border-thickness, 0px))` }}
      {...props}
    >
      {children}
    </div>
  );
};

export function GlassCard({ className, children, index = 0, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // card-neon-animated-border is removed from default. Apply it specifically where needed.
      className={cn(
        "shadow-xl hover:shadow-2xl rounded-lg", // Base rounding, border class will provide padding
        "relative overflow-hidden", // Needed if a ::before pseudo-element is used for border
        className
      )}
      {...props}
    >
      <GlassCardInnerContent>
        {children}
      </GlassCardInnerContent>
    </motion.div>
  );
}

export function GlassCardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-3 mb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

export function GlassCardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  // Changed from div to p for semantic correctness and to avoid p-in-p issues directly
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function GlassCardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-4 border-t border-border/20 mt-4", className)} {...props}>
      {children}
    </div>
  );
}
