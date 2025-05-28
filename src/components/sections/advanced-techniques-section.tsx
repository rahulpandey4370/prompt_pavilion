
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
        <GlassCard className="flex flex-col">
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
                  Chain-of-Thought (CoT) prompting encourages the AI to "think step-by-step" before providing a final answer. Instead of directly outputting the result, the model is prompted to articulate its reasoning process.
                </p>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={200} className="space-y-1">
                <p className="font-semibold text-primary">How it Works:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Typically involves providing a few examples (few-shot learning) where the intermediate reasoning steps are explicitly shown.</li>
                  <li>Prompts might include phrases like "Let's think step by step" or directly ask the AI to "Show your work."</li>
                  <li>The AI generates these intermediate thoughts before arriving at the final answer.</li>
                </ul>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Improves accuracy and reliability, especially for complex logical, arithmetic, or multi-step problems.</li>
                  <li>Makes the AI's decision-making process more transparent and interpretable.</li>
                  <li>Facilitates easier debugging of the AI's reasoning if errors occur.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="flex flex-col">
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
                  RAG grounds AI responses in external, current, or proprietary knowledge, enhancing their factual accuracy and relevance beyond the model's training data.
                </p>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={200} className="space-y-1">
                <p className="font-semibold text-primary">How it Works:</p>
                <ol className="list-decimal list-inside pl-4 space-y-1">
                  <li>User query triggers a retrieval step from a specified knowledge source (e.g., vector database of company documents, product manuals, recent news).</li>
                  <li>Relevant information snippets are retrieved based on semantic similarity or keyword matching.</li>
                  <li>This retrieved information is dynamically inserted as **additional context directly into the prompt** sent to the Large Language Model (LLM), along with the original user query.</li>
                  <li>The LLM uses this augmented prompt to generate a more informed, contextually relevant, and factually grounded answer.</li>
                </ol>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Significantly reduces AI hallucinations by providing factual grounding.</li>
                  <li>Overcomes knowledge cutoffs by incorporating up-to-date information.</li>
                  <li>Enables the AI to use domain-specific or private data securely.</li>
                  <li>Vital for applications like customer support bots, internal knowledge Q&A, and research assistants.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="flex flex-col">
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
                  ToT extends CoT by enabling the LLM to explore multiple reasoning paths (thought branches) simultaneously for a problem, rather than a single linear sequence.
                </p>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={200} className="space-y-1">
                <p className="font-semibold text-primary">How it Works:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>The model generates several distinct "thoughts" or intermediate steps for a problem.</li>
                  <li>Each thought can be evaluated (e.g., by the LLM itself via another prompt, or by programmed heuristics).</li>
                  <li>The system can then strategically decide which paths to explore further, backtrack from less promising ones, or even combine insights from different branches.</li>
                  <li>Prompts might guide this process by asking the AI to consider alternatives, assess confidence, or explain choices at each step.</li>
                </ul>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>More effective for complex problem-solving where exploration, strategic lookahead, and self-correction are crucial.</li>
                  <li>Mimics a more human-like deliberation and planning process.</li>
                  <li>Useful for tasks requiring creative solutions, planning, or navigating ambiguous scenarios with multiple potential solutions.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
