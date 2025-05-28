
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
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current); // Use ref.current in cleanup
      }
    };
  }, [delay]); // Removed ref from dependencies as it's stable

  // Split children into words for staggered animation
  const words = typeof children === 'string' ? children.split(' ') : [];

  const defaultStyle: CSSProperties = { wordSpacing: '0.2em' };
  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        className
      )}
      style={combinedStyle} // Apply combined style
      {...props}
    >
      {typeof children === 'string' ? (
        words.map((word, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-500 ease-out" // Removed conditional mr-1
            style={{
              transitionDelay: `${isVisible ? index * 100 + delay : 0}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
            }}
          >
            {word}{index < words.length - 1 ? ' ' : ''}
          </span>
        ))
      ) : (
        children
      )}
    </Tag>
  );
}
