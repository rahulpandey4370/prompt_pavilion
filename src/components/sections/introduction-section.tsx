
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card";
import { Lightbulb, Zap, BarChartHorizontalBig, Lock, Star, Scaling, Gift } from "lucide-react"; 
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  iconBgClass: string;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, iconBgClass, title, description, index }: FeatureCardProps) => {
  return (
    <GlassCard index={index} className="flex flex-col text-center items-center md:text-left md:items-start !p-6 hover:scale-105 intro-card-border">
      <motion.div
        className={cn(
          "p-3 rounded-lg mb-4 w-12 h-12 flex items-center justify-center self-center md:self-start",
          iconBgClass
        )}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="h-6 w-6 text-white" />
      </motion.div>
      <GlassCardTitle className="mb-2 text-xl !text-foreground">{title}</GlassCardTitle>
      <GlassCardDescription className="!text-foreground/70 text-sm leading-relaxed">
        {description}
      </GlassCardDescription>
    </GlassCard>
  );
};

const originalContent: Omit<FeatureCardProps, 'index'>[] = [
  {
    icon: Lightbulb,
    iconBgClass: "bg-[var(--icon-highest-quality-bg)]",
    title: "The Core Idea",
    description: "Prompt engineering is the art and science of designing effective inputs (prompts) to guide Large Language Models (LLMs) and other AI systems toward desired outputs. Think of it as giving an AI a perfectly clear and comprehensive set of instructions."
  },
  {
    icon: Zap,
    iconBgClass: "bg-[var(--icon-fast-turnaround-bg)]",
    title: "Why It Matters",
    description: "Effective prompts can dramatically improve an AI's creativity, problem-solving capabilities, and accuracy. It's the key to transforming AI from a tool into a powerful, reliable partner in various tasks."
  },
  {
    icon: BarChartHorizontalBig,
    iconBgClass: "bg-[var(--icon-predictable-pricing-bg)]",
    title: "The Tangible Impact",
    description: "Studies and practical applications consistently show that well-engineered prompts can boost AI task success rates, sometimes by over 50-70%, leading to better outcomes and more efficient use of AI resources. This studio helps you learn and master how to achieve this."
  }
];

export function IntroductionSection() {
  return (
    <SectionContainer
      id="intro"
      title="What is Prompt Engineering?"
      subtitle="Unlock the full potential of AI by mastering the art and science of crafting effective prompts."
      className="!py-12 md:!py-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
        {originalContent.map((contentItem, index) => (
          <FeatureCard
            key={contentItem.title}
            icon={contentItem.icon}
            iconBgClass={contentItem.iconBgClass}
            title={contentItem.title}
            description={contentItem.description}
            index={index}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

