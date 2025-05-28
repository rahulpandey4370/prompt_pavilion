
"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  // Allow index for animation delay, passed from where it's mapped
  index?: number; 
}

export function GlassCard({ className, children, index = 0, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger animation
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-lg", // Maintained shadow
        "transition-all hover:shadow-xl hover:border-primary/50", // Subtle hover effect
        "p-5 md:p-6", // Standardized padding
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// GlassCardHeader, Title, Description, Content, Footer can remain largely the same,
// but their internal styling might need adjustment based on the new card background.
// For the feature cards, we might not use all of them, or style them differently.

export function GlassCardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-3 mb-3", className)} {...props}> {/* Reduced bottom margin/padding slightly */}
      {children}
    </div>
  );
}

export function GlassCardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props}> {/* Adjusted for feature card title */}
      {children}
    </h3>
  );
}

export function GlassCardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    // This now renders a div, not a p tag, to allow more flexible content like lists
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
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
