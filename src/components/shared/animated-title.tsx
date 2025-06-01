
"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ElementType, ReactNode, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

interface AnimatedTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  children: ReactNode;
  delay?: number; // in milliseconds
}

export function AnimatedTitle({
  as: Tag = "h1",
  children,
  className,
  delay = 0,
  style, // Destructure style from props
  ...props // Rest of the props
}: AnimatedTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Set a timeout to ensure the initial state (hidden) is rendered before starting animation
          const timer = setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
          return () => clearTimeout(timer); // Cleanup timeout if component unmounts
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]); // Removed ref from dependencies as it's stable

  // Split by sequences of whitespace, keeping the whitespace.
  // Filter out empty strings that might result from split.
  const parts = typeof children === 'string' 
    ? children.split(/(\s+)/).filter(part => part.length > 0) 
    : [];

  // If children is not a string, or parts array is empty (e.g. children was empty string),
  // render children directly or nothing if parts is empty.
  const shouldAnimateParts = typeof children === 'string' && parts.length > 0;

  // Removed wordSpacing from defaultStyle as spaces are now explicit parts.
  // User can still pass wordSpacing via the style prop if they have a specific need for it
  // with non-string children or other advanced use cases.
  const defaultStyle: CSSProperties = {}; 
  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out", // Base transition for the container itself
        // The container's visibility is implicitly handled by children's animation
        // Or, if you want the container to fade in first:
        // isVisible && shouldAnimateParts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        className
      )}
      style={combinedStyle} // Apply combined style
      {...props}
    >
      {shouldAnimateParts ? (
        parts.map((part, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-500 ease-out"
            style={{
              whiteSpace: part.match(/^\s+$/) ? 'pre' : 'normal', // Preserve whitespace if the part is only spaces
              // Add a slight delay for the overall container visibility to settle if needed,
              // then stagger parts. Using index * 20 for stagger.
              transitionDelay: `${isVisible ? index * 20 : 0}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0px)' : 'translateY(10px)',
            }}
          >
            {part}
          </span>
        ))
      ) : (
        // Fallback for non-string children or when parts are empty
        // If !shouldAnimateParts and children is a string, it implies children was empty or only whitespace.
        // In this case, rendering children (empty string) is fine.
        // For non-string children, render them as is.
        children 
      )}
    </Tag>
  );
}
