
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Zap, Share2, Briefcase, Lightbulb, PackageSearch, BrainCircuit } from "lucide-react";
import Image from "next/image";

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
              This mimics human problem-solving by breaking down tasks into intermediate, manageable steps.
            </p>
            <div className="mt-auto">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Chain of Thought Visualization Placeholder" 
                width={600} 
                height={400} 
                className="rounded-md aspect-video object-cover mt-4" 
                data-ai-hint="animated flowchart" 
              />
              <p className="text-xs text-muted-foreground text-center mt-2">Interactive animated flowchart demonstrating step-by-step reasoning is pending implementation.</p>
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><PackageSearch className="inline-block mr-2" />Retrieval Augmented Generation (RAG)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col h-full">
            <p className="text-foreground/80 mb-4 flex-grow">
              Enhance AI responses by grounding them in external, up-to-date, or proprietary knowledge. RAG systems retrieve relevant information
              from a knowledge base (e.g., your company's documents, a specific dataset) and provide it to the LLM as context along with the user's query.
              This helps reduce hallucinations and allows the AI to answer questions based on information beyond its initial training data.
            </p>
            <div className="mt-auto">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="RAG Integration Demo Placeholder" 
                width={600} 
                height={400} 
                className="rounded-md aspect-video object-cover mt-4"
                data-ai-hint="knowledge graph" 
              />
              <p className="text-xs text-muted-foreground text-center mt-2">Visual demonstration of RAG retrieving and using external data is pending implementation.</p>
            </div>
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
              This enables more complex, multi-step problem-solving and automation capabilities.
            </p>
            <div className="mt-auto">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Agentic AI Workshop Placeholder" 
                width={600} 
                height={400} 
                className="rounded-md aspect-video object-cover mt-4"
                data-ai-hint="interactive diagram"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">Interactive workshop module for agentic behavior and tool selection is pending implementation.</p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
