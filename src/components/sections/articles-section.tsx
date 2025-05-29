
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import Link from "next/link"; // Added Link import
import { Newspaper, PenTool, BrainCircuit, BookOpen, Cloud, FileText } from "lucide-react"; // Added new icons
import type { LucideIcon } from "lucide-react";

interface Article {
  title: string;
  summary: string;
  aiHint: string;
  icon: LucideIcon;
  category: string;
  externalUrl?: string; // Added for external links
}

const articles: Article[] = [
  {
    title: "Anthropic: Prompt Engineering Overview",
    summary: "Learn core concepts and techniques for effective prompt engineering with Claude, directly from Anthropic's official documentation. Covers basics, examples, and advanced strategies.",
    aiHint: "AI documentation",
    icon: BookOpen,
    category: "Official Guide",
    externalUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
  },
  {
    title: "Google Cloud: What is Prompt Engineering?",
    summary: "Google Cloud's explanation of prompt engineering, its importance in generative AI, techniques, and best practices for designing effective prompts for large language models.",
    aiHint: "cloud learning",
    icon: Cloud,
    category: "Conceptual Overview",
    externalUrl: "https://cloud.google.com/discover/what-is-prompt-engineering",
  },
  {
    title: "OpenAI: Text Generation Guide",
    summary: "OpenAI's guide on working with their text generation models, including tips for crafting effective prompts, managing responses, and understanding model capabilities.",
    aiHint: "API guide",
    icon: FileText,
    category: "API Documentation",
    externalUrl: "https://platform.openai.com/docs/guides/text?api-mode=responses",
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
          <GlassCard key={index} className="flex flex-col hover:scale-105 transition-transform duration-200 ease-in-out article-card-border">
            {article.externalUrl ? ( 
              <Link href={article.externalUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full p-6">
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
              </Link>
            ) : (
              <div className="flex flex-col h-full p-6">
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
              </div>
            )}
          </GlassCard>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-12 text-lg">
        Explore these resources to deepen your understanding of prompt engineering.
      </p>
    </SectionContainer>
  );
}
