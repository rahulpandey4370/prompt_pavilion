
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Lightbulb, PackageSearch, GitFork } from "lucide-react";

export function AdvancedTechniquesSection() {
  return (
    <SectionContainer
      id="advanced"
      title="Advanced Techniques Showcase"
      subtitle="Dive deeper into sophisticated prompt engineering methods that unlock new AI capabilities."
    >
      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard className="flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><Lightbulb className="inline-block mr-2 h-6 w-6" />Chain-of-Thought (CoT)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
            <div className="text-foreground/80 flex-grow space-y-3 text-sm md:text-base">
              <p>
                <strong>Core Idea:</strong> Chain-of-Thought (CoT) prompting encourages the AI to "think step-by-step" before providing a final answer. Instead of directly outputting the result, the model is prompted to articulate its reasoning process.
              </p>
              <p>
                <strong>How it Works:</strong> This typically involves providing a few examples (few-shot learning) where the intermediate reasoning steps are explicitly shown. The prompt might include phrases like "Let's think step by step" or directly ask the AI to show its work.
              </p>
              <p>
                <strong>Benefits:</strong> By instructing the AI to explain its intermediate thoughts, you can often achieve more accurate and reliable results, especially for complex logical, arithmetic, or multi-step problems. It makes the AI's decision-making process more transparent and easier to debug.
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard className="flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><PackageSearch className="inline-block mr-2 h-6 w-6" />Retrieval Augmented Generation (RAG)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
            <div className="text-foreground/80 flex-grow space-y-3 text-sm md:text-base">
              <p>
                <strong>Core Idea:</strong> RAG grounds AI responses in external, current, or proprietary knowledge, enhancing their factual accuracy and relevance beyond the model's training data.
              </p>
              <p>
                <strong>How it Works:</strong>
                1.  Relevant information snippets are retrieved from a knowledge source (e.g., company documents, product database, recent news) based on the user's query.
                2.  This retrieved information is dynamically inserted as additional context directly into the prompt sent to the LLM.
                3.  The LLM uses this augmented prompt to generate a more informed and contextually relevant answer.
              </p>
              <p>
                <strong>Benefits:</strong> Significantly reduces hallucinations, overcomes knowledge cutoffs by providing up-to-date information, and enables the AI to use domain-specific or private data. Vital for applications like customer support bots or internal knowledge Q&A.
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard className="flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><GitFork className="inline-block mr-2 h-6 w-6" />Tree-of-Thought (ToT) Prompting</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
           <div className="text-foreground/80 flex-grow space-y-3 text-sm md:text-base">
              <p>
                <strong>Core Idea:</strong> ToT extends CoT by enabling the LLM to explore multiple reasoning paths simultaneously, akin to branches of a tree, rather than a single linear sequence.
              </p>
              <p>
                <strong>How it Works:</strong> The model generates several distinct thought branches for a problem. It can then evaluate the viability of each branch, strategically decide which path(s) to pursue further, backtrack from less promising ones, or even combine insights from different branches.
              </p>
              <p>
                <strong>Benefits:</strong> More effective for complex problem-solving where exploration, strategic lookahead, and self-correction are crucial. This mimics a more human-like deliberation process. Useful for tasks requiring creative solutions or navigating ambiguous scenarios. Prompts might ask the AI to consider alternatives, assess confidence in different paths, and explain its choices.
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
