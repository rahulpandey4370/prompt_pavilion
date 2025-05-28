
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Zap, Share2, Briefcase, Lightbulb, PackageSearch, BrainCircuit, GitFork, Network } from "lucide-react";

export function AdvancedTechniquesSection() {
  return (
    <SectionContainer
      id="advanced"
      title="Advanced Techniques Showcase"
      subtitle="Dive deeper into sophisticated prompt engineering methods that unlock new AI capabilities."
    >
      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><Lightbulb className="inline-block mr-2" />Chain-of-Thought (CoT)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col h-full">
            <p className="text-foreground/80 mb-4 flex-grow">
              Encourage the AI to "think step-by-step" before providing a final answer. By prompting the model to explain its reasoning process,
              you can often achieve more accurate and reliable results, especially for complex logical, arithmetic, or multi-step problems.
              This mimics human problem-solving by breaking down tasks into intermediate, manageable steps. CoT prompts typically include phrases like "Let's think step by step" or demonstrate the reasoning process through examples.
            </p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><PackageSearch className="inline-block mr-2" />Retrieval Augmented Generation (RAG)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col h-full">
            <p className="text-foreground/80 mb-4 flex-grow">
              Ground AI responses in external, current, or proprietary knowledge. RAG works by retrieving relevant information snippets 
              from a knowledge source (like company documents or a database) and **dynamically inserting this information as additional context directly into the prompt** 
              sent to the LLM. This augmented prompt, now rich with specific external data alongside the original user query, 
              enables the LLM to generate more accurate, up-to-date, and contextually relevant answers, significantly reducing 
              hallucinations and overcoming its static training data limitations. It's vital for domain-specific chatbots and 
              knowledge-intensive applications.
            </p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><GitFork className="inline-block mr-2" />Tree-of-Thought (ToT) Prompting</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col h-full">
            <p className="text-foreground/80 mb-4 flex-grow">
              Tree-of-Thought (ToT) prompting extends Chain-of-Thought by enabling the LLM to explore multiple reasoning paths 
              simultaneously. Instead of just one linear sequence of thoughts, ToT allows the model to generate several distinct 
              thought branches, evaluate their viability, and strategically decide which path to pursue or backtrack from. 
              This makes it more effective for complex problem-solving tasks where exploration and self-correction are crucial, 
              mimicking a more human-like deliberation process. It often involves prompting the model to consider alternatives, 
              assess intermediate results, and prune less promising branches.
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
