
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import Image from "next/image";
import { Newspaper, PenTool, BrainCircuit } from "lucide-react";

const articles = [
  {
    title: "The Art of Specificity: Crafting Precise Prompts",
    summary: "Dive into techniques for making your prompts unambiguous and highly targeted to achieve desired AI outputs. Learn about context setting, constraints, and example-driven prompting.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "abstract precision",
    icon: PenTool,
    category: "Techniques",
  },
  {
    title: "Beyond Basic Questions: Advanced Prompt Structures for Complex Tasks",
    summary: "Explore how to chain prompts, use meta-prompts, and design multi-turn conversational flows to tackle sophisticated problems with AI.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "complex network",
    icon: BrainCircuit,
    category: "Advanced",
  },
  {
    title: "Ethical Prompting: Ensuring Safe and Fair AI Responses",
    summary: "Understand the importance of guardrails, bias detection, and responsible AI practices when engineering prompts for real-world applications.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "ethics balance",
    icon: Newspaper,
    category: "Ethics",
  },
];

export function ArticlesSection() {
  return (
    <SectionContainer
      id="articles"
      title="Prompt Engineering Articles & Resources"
      subtitle="Expand your knowledge with our curated collection of insights, tips, and best practices in prompt engineering."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <GlassCard key={index} className="flex flex-col">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover rounded-t-lg"
              data-ai-hint={article.aiHint}
            />
            <GlassCardHeader>
              <div className="flex items-center text-sm text-primary mb-1">
                <article.icon className="w-4 h-4 mr-2" />
                {article.category}
              </div>
              <GlassCardTitle className="!text-xl text-neon-yellow">{article.title}</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="flex-grow">
              <p className="text-foreground/80 text-sm">{article.summary}</p>
            </GlassCardContent>
          </GlassCard>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-12 text-lg">
        More articles and in-depth resources coming soon!
      </p>
    </SectionContainer>
  );
}
