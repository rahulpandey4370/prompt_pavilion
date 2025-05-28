
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
                  <li>Prompts might include phrases like "Let's think step by step," "Show your work," or "Explain your reasoning before giving the final answer."</li>
                  <li>The AI is guided to generate these intermediate thoughts or logical steps as part of its output, leading to the final answer.</li>
                  <li>This process helps the model to break down complex problems into smaller, more manageable parts, improving its ability to reason through them.</li>
                </ul>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Significantly improves accuracy and reliability, especially for tasks requiring logical deduction, arithmetic calculations, or multi-step problem-solving.</li>
                  <li>Makes the AI's decision-making process more transparent and interpretable, allowing users to understand *how* an answer was derived.</li>
                  <li>Facilitates easier debugging and refinement of the AI's reasoning if errors or unexpected outputs occur.</li>
                  <li>Can elicit more robust performance on tasks where the model might otherwise take shortcuts or make superficial judgments.</li>
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
                  <li>The LLM uses this augmented prompt to generate a more informed, contextually relevant, and factually grounded answer, often citing sources.</li>
                </ol>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Significantly reduces AI hallucinations by providing factual grounding from reliable sources.</li>
                  <li>Overcomes knowledge cutoffs by incorporating up-to-date information.</li>
                  <li>Enables the AI to use domain-specific or private data securely without full model retraining.</li>
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
                  <li>The model generates several distinct "thoughts" or intermediate steps (branches) for a problem.</li>
                  <li>Each thought can be evaluated, either by the LLM itself (using another prompt to self-critique) or by programmed heuristics.</li>
                  <li>The system can then strategically decide which paths to explore further, backtrack from less promising ones, or combine insights from different branches.</li>
                  <li>Prompts might guide this by asking for alternatives, confidence scores, or choices at each step.</li>
                </ul>
              </AnimatedTitle>
              <AnimatedTitle as="div" delay={300} className="space-y-1">
                <p className="font-semibold text-primary">Benefits:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>More effective for complex problem-solving where exploration, strategic lookahead, planning, and self-correction are crucial.</li>
                  <li>Mimics a more human-like deliberation and planning process, allowing for more robust solutions.</li>
                  <li>Useful for tasks requiring creative solutions, planning, or navigating ambiguous scenarios with multiple potential outcomes.</li>
                  <li>Can lead to higher quality outputs by systematically exploring and pruning the solution space.</li>
                </ul>
              </AnimatedTitle>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
