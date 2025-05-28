
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { AnimatedTitle } from "./animated-title";

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  isContainedCard?: boolean; // New prop to trigger card-like styling
}

export function SectionContainer({
  id,
  title,
  subtitle,
  children,
  className,
  titleClassName,
  subtitleClassName,
  isContainedCard = false, // Default to false
  ...props
}: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }} // Basic entrance animation for the section
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "py-16 md:py-24 min-h-[90vh] flex flex-col justify-center items-center overflow-hidden", // Min height and centering
        isContainedCard ? "bg-[hsl(var(--background-card-container-raw))] rounded-2xl shadow-2xl my-10 md:my-16" : "", // Styles for the large container card
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-full", 
        isContainedCard ? "px-6 sm:px-10 lg:px-16 py-10 md:py-12" : "px-6 sm:px-10 lg:px-16" // Padding adjustments
      )}>
        {title && (
          <AnimatedTitle
            as="h2"
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-foreground font-title", // Maintained white title as per image
              titleClassName
            )}
          >
            {title}
          </AnimatedTitle>
        )}
        {subtitle && (
          <AnimatedTitle
            as="p" // Changed to AnimatedTitle for consistency
            delay={200}
            className={cn("text-base md:text-lg text-center text-foreground/70 mb-10 md:mb-12 max-w-3xl mx-auto", subtitleClassName)}
          >
            {subtitle}
          </AnimatedTitle>
        )}
        {children}
      </div>
    </motion.section>
  );
}
