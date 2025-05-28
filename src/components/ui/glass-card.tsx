
"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  index?: number; 
}

// Inner component to hold the actual card content, sits inside the animated border
const GlassCardInnerContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground w-full h-full",
        // This needs to be rounded *less* than the parent's padding for the border to show.
        // If parent is rounded-lg (var(--radius)), this should be calc(var(--radius) - var(--neon-border-thickness))
        "p-5 md:p-6", // Original content padding from GlassCard
        className
      )}
      // Apply precise rounding with inline style to respect --neon-border-thickness
      style={{ borderRadius: `calc(var(--radius) - var(--neon-border-thickness))` }}
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
      className={cn(
        "card-neon-animated-border", // Applies animated gradient bg and padding
        "shadow-xl hover:shadow-2xl", // Enhanced shadow for neon pop
        // The main rounding (var(--radius)) is applied by .card-neon-animated-border
        // No direct 'rounded-lg' here anymore, it's part of the CSS class.
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
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  // Removed default padding from here as GlassCardInnerContent now handles it.
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
