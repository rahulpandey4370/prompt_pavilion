
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
  isContainedCard?: boolean;
}

export function SectionContainer({
  id,
  title,
  subtitle,
  children,
  className,
  titleClassName,
  subtitleClassName,
  isContainedCard = false,
  ...props
}: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex flex-col justify-center items-center overflow-hidden",
        isContainedCard 
          ? "my-10 md:my-16 w-full" // Removed border-2 border-primary rounded-2xl shadow-2xl
          : "py-16 md:py-24 min-h-[90vh] w-full", 
        isContainedCard ? "!py-12 md:!py-16" : "", 
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-full h-full", 
        isContainedCard 
          ? "bg-[hsl(var(--background-card-container-raw))] max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 md:py-12 rounded-[calc(var(--radius)+0.3rem)] shadow-2xl" // Retained shadow for depth
          : "w-full px-6 sm:px-10 lg:px-16"
      )}
      >
        {title && (
          <AnimatedTitle
            as="h2"
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-foreground",
              titleClassName
            )}
          >
            {title}
          </AnimatedTitle>
        )}
        {subtitle && (
          <AnimatedTitle
            as="p"
            delay={200}
            className={cn("text-base md:text-lg text-center text-foreground/70 mb-10 md:mb-12 max-w-5xl mx-auto", subtitleClassName)}
          >
            {subtitle}
          </AnimatedTitle>
        )}
        {children}
      </div>
    </motion.section>
  );
}
