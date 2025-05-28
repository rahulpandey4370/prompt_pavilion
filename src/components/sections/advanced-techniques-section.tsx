
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Zap, Share2, Briefcase, Lightbulb, PackageSearch, BrainCircuit } from "lucide-react";
// import Image from "next/image"; // Image component no longer needed

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
              Enhance AI responses by grounding them in external, up-to-date, or proprietary knowledge. RAG systems retrieve relevant information
              from a knowledge base (e.g., your company's documents, a specific dataset, recent news articles) and provide it to the LLM as context along with the user's query.
              This helps reduce hallucinations, improves factual accuracy, and allows the AI to answer questions based on information beyond its initial training data. It's key for domain-specific chatbots and knowledge-intensive tasks.
            </p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><BrainCircuit className="inline-block mr-2" />Agentic AI & Tool Use</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col h-full">
            <p className="text-foreground/80 mb-4 flex-grow">
              Empower AIs to perform actions and interact with external systems. Agentic AI involves designing prompts and systems where the LLM can
              autonomously decide to use predefined "tools" (functions or APIs) to gather information, execute tasks, or interact with other services.
              This enables more complex, multi-step problem-solving and automation capabilities, allowing LLMs to act as intelligent agents that can, for example, book appointments, query databases, or control smart devices.
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
