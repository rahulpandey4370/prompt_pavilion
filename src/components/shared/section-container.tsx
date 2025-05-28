import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { AnimatedTitle } from "./animated-title";

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionContainer({
  id,
  title,
  subtitle,
  children,
  className,
  titleClassName,
  subtitleClassName,
  ...props
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24 min-h-screen flex flex-col justify-center items-center", className)}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <AnimatedTitle
            as="h2"
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-primary font-title", // Added font-title and increased mb-4 to mb-6
              titleClassName
            )}
          >
            {title}
          </AnimatedTitle>
        )}
        {subtitle && (
          <p className={cn("text-lg md:text-xl text-center text-foreground/80 mb-12 md:mb-16 max-w-3xl mx-auto", subtitleClassName)}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
