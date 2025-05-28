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
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {title && (
          <AnimatedTitle
            as="h2"
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-primary font-title",
              titleClassName
            )}
          >
            {title}
          </AnimatedTitle>
        )}
        {subtitle && (
          <p className={cn("text-lg md:text-xl text-center text-foreground/80 mb-12 md:mb-16 max-w-5xl mx-auto", subtitleClassName)}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
