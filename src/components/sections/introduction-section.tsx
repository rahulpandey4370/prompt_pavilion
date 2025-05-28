
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card";
import { Lightbulb, Zap, BarChartHorizontalBig } from "lucide-react"; // Original icons
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  icon: LucideIcon;
  iconBgClass: string;
  title: string;
  description: string;
  index: number;
}

const ContentCard = ({ icon: Icon, iconBgClass, title, description, index }: ContentCardProps) => {
  return (
    <GlassCard index={index} className="flex flex-col text-center items-center md:text-left md:items-start !p-6 hover:scale-105">
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

const originalContent: Omit<ContentCardProps, 'index'>[] = [
  {
    icon: Lightbulb,
    iconBgClass: "bg-[var(--icon-highest-quality-bg)]", // Using yellow/gold
    title: "The Core Idea",
    description: "Prompt engineering is like giving an AI a perfect set of instructions. The better the instructions, the better the AI's performance and the more accurate and relevant its output."
  },
  {
    icon: Zap,
    iconBgClass: "bg-[var(--icon-fast-turnaround-bg)]", // Using vivid purple
    title: "Why It Matters",
    description: "Effective prompts can dramatically improve AI's creativity, problem-solving, and accuracy. It's the key to transforming AI from a tool into a powerful partner."
  },
  {
    icon: BarChartHorizontalBig,
    iconBgClass: "bg-[var(--icon-predictable-pricing-bg)]", // Using vivid blue
    title: "The Tangible Impact",
    description: "Studies show well-engineered prompts can boost AI task success rates by over 50%. This studio helps you learn how. (Placeholder for animated counter/chart)"
  }
];

export function IntroductionSection() {
  return (
    <SectionContainer
      id="intro"
      title="What is Prompt Engineering?"
      subtitle="Unlock the full potential of AI by mastering the art and science of crafting effective prompts."
      isContainedCard={true} 
      className="!py-12 md:!py-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
        {originalContent.map((contentItem, index) => (
          <ContentCard
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
