
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Lightbulb, PackageSearch, GitFork } from "lucide-react";
import { AnimatedTitle } from "@/components/shared/animated-title";

export function AdvancedTechniquesSection() {
  return (
    <SectionContainer
      id="advanced"
      title="Advanced Techniques Showcase"
      subtitle="Dive deeper into sophisticated prompt engineering methods that unlock new AI capabilities."
    >
      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard className="flex flex-col advanced-card-border">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center">
              <Lightbulb className="inline-block mr-2 h-6 w-6" />Chain-of-Thought (CoT)
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
            <div className="text-foreground/80 flex-grow space-y-4 text-sm md:text-base">
              <AnimatedTitle as="div" delay={100} className="space-y-1">
                <p className="font-semibold text-primary">Core Idea:</p>
                <p>
                  Encourages AI to articulate its reasoning step-by-step before giving a final answer, improving accuracy for complex tasks.
                </p>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={200} className="space-y-1">
                <p className="font-semibold text-primary">How it Works:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Provide examples showing intermediate reasoning steps (few-shot).</li>
                  <li>Prompt with phrases like "Let's think step by step."</li>
                  <li>AI generates logical steps leading to the final answer.</li>
                </ul>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Improves accuracy for logical, arithmetic, or multi-step problems.</li>
                  <li>Makes AI decision-making more transparent and interpretable.</li>
                  <li>Facilitates easier debugging of the AI's reasoning.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="flex flex-col advanced-card-border">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center">
              <PackageSearch className="inline-block mr-2 h-6 w-6" />Retrieval Augmented Generation (RAG)
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
            <div className="text-foreground/80 flex-grow space-y-4 text-sm md:text-base">
              <AnimatedTitle as="div" delay={100} className="space-y-1">
                <p className="font-semibold text-primary">Core Idea:</p>
                <p>
                  Grounds AI responses in external, current, or proprietary knowledge, enhancing factual accuracy and relevance.
                </p>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={200} className="space-y-1">
                <p className="font-semibold text-primary">How it Works:</p>
                <ol className="list-decimal list-inside pl-4 space-y-1">
                  <li>User query triggers retrieval from a knowledge source (e.g., vector DB).</li>
                  <li>Relevant info snippets are fetched.</li>
                  <li>Retrieved info is added as context to the LLM prompt with the query.</li>
                  <li>LLM generates an informed, contextually relevant answer.</li>
                </ol>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Reduces AI hallucinations by providing factual grounding.</li>
                  <li>Overcomes knowledge cutoffs with up-to-date information.</li>
                  <li>Enables AI to use domain-specific or private data securely.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="flex flex-col advanced-card-border">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center">
              <GitFork className="inline-block mr-2 h-6 w-6" />Tree-of-Thought (ToT) Prompting
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
           <div className="text-foreground/80 flex-grow space-y-4 text-sm md:text-base">
              <AnimatedTitle as="div" delay={100} className="space-y-1">
                <p className="font-semibold text-primary">Core Idea:</p>
                <p>
                  Extends CoT by enabling the LLM to explore multiple reasoning paths (thought branches) simultaneously for a problem.
                </p>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={200} className="space-y-1">
                <p className="font-semibold text-primary">How it Works:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Model generates several distinct "thoughts" or intermediate steps.</li>
                  <li>Each thought can be evaluated (by LLM self-critique or heuristics).</li>
                  <li>System strategically decides which paths to explore, backtrack, or combine.</li>
                </ul>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Effective for complex problems requiring exploration and planning.</li>
                  <li>Mimics human-like deliberation and self-correction.</li>
                  <li>Useful for creative tasks or navigating ambiguous scenarios.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
