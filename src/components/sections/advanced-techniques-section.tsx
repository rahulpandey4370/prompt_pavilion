
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
            <p className="text-foreground/80 mb-4 flex-grow space-y-3">
              <span>
                Chain-of-Thought (CoT) prompting encourages the AI to "think step-by-step" before providing a final answer. Instead of directly outputting the result, the model is prompted to articulate its reasoning process. This typically involves providing a few examples (few-shot) where the reasoning steps are explicitly shown.
              </span>
              <span>
                By instructing the AI to explain its intermediate thoughts, you can often achieve more accurate and reliable results, especially for complex logical, arithmetic, or multi-step problems. This mimics human problem-solving by breaking down tasks into manageable steps. CoT makes the AI's decision-making process more transparent and easier to debug. Common CoT prompts include phrases like "Let's think step by step" or "Show your work."
              </span>
            </p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard className="flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><PackageSearch className="inline-block mr-2 h-6 w-6" />Retrieval Augmented Generation (RAG)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
            <p className="text-foreground/80 mb-4 flex-grow space-y-3">
              <span>
                Retrieval Augmented Generation (RAG) grounds AI responses in external, current, or proprietary knowledge, enhancing their factual accuracy and relevance. RAG works by first retrieving relevant information snippets from a knowledge source (like company documents, a product database, or recent news articles) based on the user's query. 
              </span>
              <span>
                This retrieved information is then **dynamically inserted as additional context directly into the prompt** sent to the Large Language Model (LLM). This augmented prompt, now rich with specific external data alongside the original user query, enables the LLM to generate more accurate, up-to-date, and contextually relevant answers. This significantly reduces hallucinations and overcomes the limitations of the AI's static training data. RAG is vital for domain-specific chatbots, question-answering systems, and knowledge-intensive applications.
              </span>
            </p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard className="flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent flex items-center"><GitFork className="inline-block mr-2 h-6 w-6" />Tree-of-Thought (ToT) Prompting</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col flex-grow">
            <p className="text-foreground/80 mb-4 flex-grow space-y-3">
              <span>
                Tree-of-Thought (ToT) prompting extends Chain-of-Thought by enabling the LLM to explore multiple reasoning paths simultaneously, like branches of a tree. Instead of just one linear sequence of thoughts, ToT allows the model to generate several distinct thought branches for a given problem.
              </span>
              <span>
                The model can then evaluate the viability of each branch, strategically decide which path to pursue further, or backtrack from less promising ones. This makes ToT more effective for complex problem-solving tasks where exploration, strategic lookahead, and self-correction are crucial, mimicking a more human-like deliberation process. It often involves prompting the model to consider alternatives, assess intermediate results, and prune or prioritize thought branches based on their perceived success or coherence.
              </span>
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
