
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
  description: string[]; // Changed to array of strings for multiple paragraphs
  listItems?: string[]; // Optional list items
  index: number;
  borderClass: string;
}

const FeatureCard = ({ icon: Icon, iconBgClass, title, description, listItems, index, borderClass }: FeatureCardProps) => {
  return (
    <GlassCard index={index} className={cn("flex flex-col text-center items-center md:text-left md:items-start !p-6 hover:scale-105", borderClass)}>
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
      <GlassCardContent className="!p-0 space-y-3"> {/* Use GlassCardContent and manage spacing here */}
        {description.map((paragraph, pIndex) => (
          <GlassCardDescription key={pIndex} className="!text-foreground/70 text-sm leading-relaxed">
            {paragraph}
          </GlassCardDescription>
        ))}
        {listItems && (
          <ul className="list-disc list-inside pl-1 space-y-1 text-foreground/70 text-sm leading-relaxed text-left">
            {listItems.map((item, lIndex) => (
              <li key={lIndex}>{item}</li>
            ))}
          </ul>
        )}
      </GlassCardContent>
    </GlassCard>
  );
};

const originalContent: Omit<FeatureCardProps, 'index' | 'borderClass'>[] = [
  {
    icon: Lightbulb,
    iconBgClass: "bg-[var(--icon-highest-quality-bg)]",
    title: "The Core Idea",
    description: [
      "Prompt engineering is the art and science of designing effective inputs (prompts) to guide Large Language Models (LLMs) and other AI systems toward desired outputs.",
      "Think of it as giving an AI a perfectly clear and comprehensive set of instructions for a specific task."
    ]
  },
  {
    icon: Zap,
    iconBgClass: "bg-[var(--icon-fast-turnaround-bg)]",
    title: "Why It Matters",
    description: [
      "Effective prompts can dramatically improve an AI's creativity, problem-solving capabilities, and accuracy.",
      "It's the key to transforming AI from a general tool into a powerful, reliable partner tailored for various tasks, leading to higher quality and more dependable outcomes."
    ],
  },
  {
    icon: BarChartHorizontalBig,
    iconBgClass: "bg-[var(--icon-predictable-pricing-bg)]",
    title: "The Tangible Impact",
    description: [
      "Studies and practical applications consistently show that well-engineered prompts can boost AI task success rates, sometimes by over 50-70%. This directly leads to better outcomes, more efficient use of AI resources, and reduced need for manual correction or re-work.",
      "This studio helps you learn and master how to achieve this."
    ],
  }
];

const cardBorders = ["intro-card-border", "article-card-border", "advanced-card-border"];


export function IntroductionSection() {
  return (
    <SectionContainer
      id="intro"
      title="What is Prompt Engineering?"
      subtitle="&quot;Prompt engineering is like giving an AI super-clear instructions for a task. It's the art of carefully choosing your words and structure when you ask an AI to do something. This helps the AI understand exactly what you want, leading to much better, more accurate, and more useful results. Think of it as being a great communicator, but with artificial intelligence.&quot;"
      subtitleClassName="italic"
      className="!py-12 md:!py-16" // Ensure specific padding overrides default
      isContainedCard={true} // This will apply the large container card styling
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
        {originalContent.map((contentItem, index) => (
          <FeatureCard
            key={contentItem.title}
            icon={contentItem.icon}
            iconBgClass={contentItem.iconBgClass}
            title={contentItem.title}
            description={contentItem.description}
            listItems={contentItem.listItems}
            index={index}
            borderClass={cardBorders[index % cardBorders.length]} // Cycle through border classes
          />
        ))}
      </div>
    </SectionContainer>
  );
}
