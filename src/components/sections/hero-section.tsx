
"use client";

import { Button } from "@/components/ui/button";
import { AnimatedTitle } from "@/components/shared/animated-title";
import { ArrowDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface ParticleStyle extends CSSProperties {}

export function HeroSection() {
  const [accentParticlesStyles, setAccentParticlesStyles] = useState<ParticleStyle[]>([]);
  const [primaryParticlesStyles, setPrimaryParticlesStyles] = useState<ParticleStyle[]>([]);

  useEffect(() => {
    const generateStyles = (count: number, isAccent: boolean): ParticleStyle[] => {
      return Array.from({ length: count }, () => ({
        width: `${Math.random() * (isAccent ? 3 : 4) + 1}px`,
        height: `${Math.random() * (isAccent ? 3 : 4) + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * (isAccent ? 5 : 6)}s`,
        animationDuration: `${Math.random() * (isAccent ? 5 : 6) + (isAccent ? 5 : 6)}s`,
      }));
    };

    setAccentParticlesStyles(generateStyles(30, true));
    setPrimaryParticlesStyles(generateStyles(20, false));
  }, []); // Empty dependency array ensures this runs only on client-side after mount

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4 bg-gradient-to-br from-background to-purple-900/30">
      {/* Particle-like background */}
      <div className="absolute inset-0 z-0 opacity-20">
        {accentParticlesStyles.map((style, i) => (
          <div
            key={`accent-${i}`}
            className="absolute bg-accent rounded-full animate-pulse"
            style={style}
          />
        ))}
         {primaryParticlesStyles.map((style, i) => (
          <div
            key={`primary-${i}`}
            className="absolute bg-primary rounded-full animate-pulse"
            style={style}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto">
        <AnimatedTitle
          as="h1"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            PromptCraft Studio
          </span>
        </AnimatedTitle>

        <AnimatedTitle
          as="p"
          delay={300}
          className="text-xl sm:text-2xl md:text-3xl text-foreground/80 mb-10 max-w-3xl mx-auto"
        >
          Where  AI  Magic  Meets  Prompt  Engineering
        </AnimatedTitle>

        <div className="animate-fadeInGrow" style={{animationDelay: '600ms', opacity: 0}}>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg group shadow-lg hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105">
            <Link href="#intro">
              Start Building <Sparkles className="ml-2 h-5 w-5 group-hover:animate-ping" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <Link href="#intro" aria-label="Scroll to introduction">
          <ArrowDown className="h-8 w-8 text-primary/70 hover:text-primary transition-colors" />
        </Link>
      </div>
    </section>
  );
}
