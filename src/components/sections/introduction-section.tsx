
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card";
import { Lock, Zap, Star, Scaling, Gift } from "lucide-react"; // Added new icons
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Added missing import

interface FeatureCardProps {
  icon: LucideIcon;
  iconBgClass: string; // Tailwind class for icon background
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, iconBgClass, title, description, index }: FeatureCardProps) => {
  return (
    <GlassCard index={index} className="flex flex-col text-center items-center md:text-left md:items-start !p-6 hover:scale-105"> {/* Ensure padding and hover effect */}
      <motion.div 
        className={cn("p-3 rounded-lg mb-4 w-12 h-12 flex items-center justify-center", iconBgClass)}
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

const features: Omit<FeatureCardProps, 'index'>[] = [
  {
    icon: Lock,
    iconBgClass: "bg-[var(--icon-predictable-pricing-bg)]",
    title: "Predictable Pricing",
    description: "One flat monthly fee for unlimited design requests. No surprise costs or hidden fees."
  },
  {
    icon: Zap,
    iconBgClass: "bg-[var(--icon-fast-turnaround-bg)]",
    title: "Fast Turnaround",
    description: "Get your designs within 24-48 hours. Need revisions? We'll handle them right away."
  },
  {
    icon: Star,
    iconBgClass: "bg-[var(--icon-highest-quality-bg)]",
    title: "Highest Quality",
    description: "Senior-level design quality at your fingertips, whenever you need it."
  },
  {
    icon: Scaling, // Using Scaling icon
    iconBgClass: "bg-[var(--icon-scale-anytime-bg)]",
    title: "Scale Anytime",
    description: "Scale up or down as needed, and pause or cancel at anytime."
  },
  {
    icon: Gift, // Using Gift icon
    iconBgClass: "bg-[var(--icon-unique-yours-bg)]",
    title: "Unique & All Yours",
    description: "Every design is made especially for you and is 100% yours."
  }
];

export function IntroductionSection() {
  return (
    <SectionContainer
      id="intro"
      title="WHY CHOOSE SUBSCRIPTION?"
      subtitle="Get reliable, high-quality design without the overhead of hiring in-house or dealing with freelancers."
      isContainedCard={true} // This will make SectionContainer look like the large card
      className="!py-12 md:!py-16" // Adjust padding for the container card
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 w-full">
        {features.map((feature, index) => (
          <FeatureCard 
            key={feature.title}
            icon={feature.icon}
            iconBgClass={feature.iconBgClass}
            title={feature.title}
            description={feature.description}
            index={index} // Pass index for staggered animation
          />
        ))}
      </div>
    </SectionContainer>
  );
}

